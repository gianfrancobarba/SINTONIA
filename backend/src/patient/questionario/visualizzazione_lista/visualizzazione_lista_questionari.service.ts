import { Injectable } from '@nestjs/common';
import { StoricoQuestionariDto, QuestionarioItemDto } from '../../home/dto/questionari.dto.js';
import { db } from '../../../drizzle/db.js';
import { paziente, questionario, tipologiaQuestionario } from '../../../drizzle/schema.js';
import { eq, desc, sql } from 'drizzle-orm';

@Injectable()
export class Visualizzazione_lista_questionariService {
    async getStoricoQuestionari(userId: string, page: number = 1, limit: number = 10): Promise<StoricoQuestionariDto> {
        // 1. Recupera data ingresso paziente
        const patientRow = await db
            .select({ dataIngresso: paziente.dataIngresso })
            .from(paziente)
            .where(eq(paziente.idPaziente, userId))
            .limit(1);

        const dataIngressoStr = patientRow[0]?.dataIngresso;
        if (!dataIngressoStr) {
            return {
                daCompilare: [],
                completati: [],
                totalCompletati: 0,
                currentPage: page,
                totalPages: 0,
            };
        }

        // 2. Calcola giorni da ingresso
        const dataIngressoDate = new Date(dataIngressoStr);
        const today = new Date();
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysSinceIngresso = Math.floor((today.getTime() - dataIngressoDate.getTime()) / msPerDay);

        // 3. Ottieni tutte le tipologie questionari e filtra quelle dovute
        const allTypes = await db
            .select({
                nome: tipologiaQuestionario.nome,
                tempo: tipologiaQuestionario.tempoSomministrazione,
            })
            .from(tipologiaQuestionario);

        const dueTypes = allTypes.filter(t => t.tempo <= daysSinceIngresso);

        // 4. Conta il totale dei questionari compilati
        const totalCountResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(questionario)
            .where(eq(questionario.idPaziente, userId));

        const totalCompletati = totalCountResult[0]?.count || 0;
        const totalPages = Math.ceil(totalCompletati / limit);

        // 5. Ottieni questionari compilati con paginazione
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

        // 6. Crea set di tipologie già compilate
        const compiledSet = new Set(compiled.map(c => c.nomeTipologia));

        // 7. Filtra le tipologie dovute rimuovendo quelle già compilate
        const pendingTypes = dueTypes.filter(t => !compiledSet.has(t.nome));

        // 8. Formatta i dati per il DTO

        // Questionari da compilare
        const daCompilare: QuestionarioItemDto[] = pendingTypes.map((tipo) => {
            const dataInserimento = new Date(dataIngressoDate);
            dataInserimento.setDate(dataInserimento.getDate() + tipo.tempo);

            // Calcola una scadenza suggerita (es. 30 giorni dalla data di disponibilità)
            const scadenzaDate = new Date(dataInserimento);
            scadenzaDate.setDate(scadenzaDate.getDate() + 30);

            return {
                id: tipo.nome, // Usiamo il nome come ID per i questionari da compilare
                titolo: tipo.nome,
                descrizione: `Inserito il ${this.formatDate(dataInserimento)}. Clicca per Compilare!`,
                scadenza: this.formatDate(scadenzaDate),
            };
        });

        // Questionari completati
        const completati: QuestionarioItemDto[] = compiled.map((q) => ({
            id: q.idQuestionario,
            titolo: q.nomeTipologia,
            descrizione: `Compilato il ${this.formatDate(q.dataCompilazione)}.`,
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
}
