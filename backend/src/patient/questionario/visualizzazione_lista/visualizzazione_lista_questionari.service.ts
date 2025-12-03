import { Injectable } from '@nestjs/common';
import { StoricoQuestionariDto, QuestionarioItemDto } from '../../home/dto/questionari.dto.js';
import { db } from '../../../drizzle/db.js';
import { paziente, questionario, tipologiaQuestionario } from '../../../drizzle/schema.js';
import { eq, desc, sql, and } from 'drizzle-orm';

@Injectable()
export class Visualizzazione_lista_questionariService {
    async getStoricoQuestionari(userId: string, page: number = 1, limit: number = 10): Promise<StoricoQuestionariDto> {
        // 1. Verifica che il paziente esista
        const patientRow = await db
            .select({ dataIngresso: paziente.dataIngresso })
            .from(paziente)
            .where(eq(paziente.idPaziente, userId))
            .limit(1);

        if (!patientRow[0]) {
            return {
                daCompilare: [],
                completati: [],
                totalCompletati: 0,
                currentPage: page,
                totalPages: 0,
            };
        }

        const today = new Date();
        const msPerDay = 1000 * 60 * 60 * 24;

        // 2. Ottieni tutte le tipologie di questionari disponibili
        const allTypes = await db
            .select({
                nome: tipologiaQuestionario.nome,
                tempoSomministrazione: tipologiaQuestionario.tempoSomministrazione,
            })
            .from(tipologiaQuestionario);

        // 3. Per ogni tipologia, trova l'ultima compilazione del paziente
        const lastCompilationByType = new Map<string, { date: Date, id: string, score: number | null }>();

        for (const tipo of allTypes) {
            const lastCompilation = await db
                .select({
                    idQuestionario: questionario.idQuestionario,
                    dataCompilazione: questionario.dataCompilazione,
                    score: questionario.score,
                })
                .from(questionario)
                .where(
                    and(
                        eq(questionario.idPaziente, userId),
                        eq(questionario.nomeTipologia, tipo.nome)
                    )
                )
                .orderBy(desc(questionario.dataCompilazione))
                .limit(1);

            if (lastCompilation.length > 0) {
                lastCompilationByType.set(tipo.nome, {
                    date: new Date(lastCompilation[0].dataCompilazione),
                    id: lastCompilation[0].idQuestionario,
                    score: lastCompilation[0].score,
                });
            }
        }

        // 4. Determina quali questionari sono da compilare
        const daCompilare: QuestionarioItemDto[] = [];

        for (const tipo of allTypes) {
            const lastCompilation = lastCompilationByType.get(tipo.nome);

            if (!lastCompilation) {
                // Caso 1: Mai compilato -> mostra sempre
                daCompilare.push({
                    id: tipo.nome,
                    titolo: tipo.nome,
                    descrizione: `Questionario mai compilato. Clicca per compilare!`,
                    scadenza: undefined,
                });
            } else {
                // Caso 2: Già compilato -> verifica se è passato abbastanza tempo
                const daysSinceLastCompilation = Math.floor(
                    (today.getTime() - lastCompilation.date.getTime()) / msPerDay
                );

                if (daysSinceLastCompilation >= tipo.tempoSomministrazione) {
                    // È passato abbastanza tempo -> mostra di nuovo
                    const nextAvailableDate = new Date(lastCompilation.date);
                    nextAvailableDate.setDate(nextAvailableDate.getDate() + tipo.tempoSomministrazione);

                    daCompilare.push({
                        id: tipo.nome,
                        titolo: tipo.nome,
                        descrizione: `Ultima compilazione: ${this.formatDate(lastCompilation.date)}. Disponibile per ricompilazione!`,
                        scadenza: undefined,
                    });
                }
            }
        }

        // 5. Conta il totale dei questionari compilati
        const totalCountResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(questionario)
            .where(eq(questionario.idPaziente, userId));

        const totalCompletati = totalCountResult[0]?.count || 0;
        const totalPages = Math.ceil(totalCompletati / limit);

        // 6. Ottieni questionari completati con paginazione (tutti, non solo l'ultimo per tipologia)
        const offset = (page - 1) * limit;
        const compiled = await db
            .select({
                idQuestionario: questionario.idQuestionario,
                nomeTipologia: questionario.nomeTipologia,
                dataCompilazione: questionario.dataCompilazione,
                score: questionario.score,
            })
            .from(questionario)
            .where(eq(questionario.idPaziente, userId))
            .orderBy(desc(questionario.dataCompilazione))
            .limit(limit)
            .offset(offset);

        // 7. Formatta i questionari completati
        const completati: QuestionarioItemDto[] = compiled.map((q) => ({
            id: q.idQuestionario,
            titolo: q.nomeTipologia,
            descrizione: `Compilato il ${this.formatDate(q.dataCompilazione)}`,
            dataCompletamento: this.formatDate(q.dataCompilazione),
        }));

        return {
            daCompilare,
            completati,
            totalCompletati,
            currentPage: page,
            totalPages,
        };
    }

    // Helper per formattare le date in formato italiano
    private formatDate(date: Date | string): string {
        const d = typeof date === 'string' ? new Date(date) : date;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    /**
     * Verifica se il paziente ha compilato almeno una volta tutti e 4 i questionari iniziali
     * I questionari iniziali sono: PHQ-9, GAD-7, WHO-5, PC-PTSD-5
     * @param userId - ID del paziente
     * @returns true se ha compilato tutti e 4, false altrimenti
     */
    async hasCompletedInitialQuestionnaires(userId: string): Promise<boolean> {
        const INITIAL_QUESTIONNAIRES = ['PHQ-9', 'GAD-7', 'WHO-5', 'PC-PTSD-5'];

        // Per ogni questionario iniziale, verifica se esiste almeno una compilazione
        for (const questionnaireName of INITIAL_QUESTIONNAIRES) {
            const compilations = await db
                .select({ id: questionario.idQuestionario })
                .from(questionario)
                .where(
                    and(
                        eq(questionario.idPaziente, userId),
                        eq(questionario.nomeTipologia, questionnaireName)
                    )
                )
                .limit(1);

            // Se anche solo uno dei questionari non è mai stato compilato, ritorna false
            if (compilations.length === 0) {
                return false;
            }
        }

        // Tutti e 4 i questionari sono stati compilati almeno una volta
        return true;
    }
}
