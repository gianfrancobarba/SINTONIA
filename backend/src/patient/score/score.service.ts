import { Injectable } from '@nestjs/common';
import { eq, and, sql, lte } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { paziente, questionario, tipologiaQuestionario } from '../../drizzle/schema.js';
import { PatientScoreDto } from './dto/score.dto.js';
import { PrioritaService } from '../priorita/priorita.service.js';

@Injectable()
export class ScoreService {
    constructor(private readonly prioritaService: PrioritaService) { }

    // Questionari di screening richiesti
    private readonly SCREENING_QUESTIONNAIRES = ['PHQ-9', 'GAD-7', 'WHO-5', 'PC-PTSD-5'];

    /**
     * Verifica se il paziente ha completato tutti i questionari di screening
     */
    async hasCompletedScreening(idPaziente: string): Promise<boolean> {
        for (const nomeQuestionario of this.SCREENING_QUESTIONNAIRES) {
            const result = await db
                .select({ count: sql<number>`count(*)::int` })
                .from(questionario)
                .where(
                    and(
                        eq(questionario.idPaziente, idPaziente),
                        eq(questionario.nomeTipologia, nomeQuestionario)
                    )
                )
                .limit(1);

            const count = result[0]?.count || 0;
            if (count === 0) {
                return false; // Manca almeno un questionario di screening
            }
        }

        return true; // Tutti i questionari di screening sono stati compilati
    }

    /**
     * Calcola lo score del paziente usando decadimento esponenziale
     * 
     * Algoritmo:
     * 1. Raggruppa questionari per tipologia
     * 2. Per ogni tipologia, calcola λ basato su tempoSomministrazione
     * 3. Applica peso esponenziale con peso minimo 20%
     * 4. Calcola media ponderata per tipologia
     * 5. Aggrega con media semplice tra tipologie
     * 
     * Parametri:
     * - PESO_MINIMO = 0.20 (20%)
     * - N_CICLI_DECADIMENTO = 3 (raggiunge peso minimo dopo 3 compilazioni)
     * 
     * Restituisce null se lo screening non è completo o non ci sono questionari
     */
    async calculatePatientScore(idPaziente: string, dataRiferimento: Date = new Date()): Promise<number | null> {
        const PESO_MINIMO = 0.20;
        const N_CICLI_DECADIMENTO = 3;

        // 1. Verifica che lo screening sia completo
        const screeningCompleto = await this.hasCompletedScreening(idPaziente);
        if (!screeningCompleto) {
            return null;
        }

        // 2. Ottieni tutti i questionari con tipologia e data (escludi invalidati)
        const questionari = await db
            .select({
                score: questionario.score,
                nomeTipologia: questionario.nomeTipologia,
                dataCompilazione: questionario.dataCompilazione,
                invalidato: questionario.invalidato,
            })
            .from(questionario)
            .where(
                and(
                    eq(questionario.idPaziente, idPaziente),
                    lte(questionario.dataCompilazione, dataRiferimento) // Filtra per data riferimento
                )
            )
            .orderBy(questionario.dataCompilazione);

        // 3. Filtra solo questionari con score valido e NON invalidati
        const questionariValidi = questionari.filter(q => q.score !== null && q.invalidato === false);

        if (questionariValidi.length === 0) {
            return null;
        }

        // 4. Raggruppa per tipologia
        const perTipologia = new Map<string, Array<{ score: number; dataCompilazione: Date }>>();

        for (const q of questionariValidi) {
            if (!perTipologia.has(q.nomeTipologia)) {
                perTipologia.set(q.nomeTipologia, []);
            }
            perTipologia.get(q.nomeTipologia)!.push({
                score: q.score as number,
                dataCompilazione: new Date(q.dataCompilazione),
            });
        }

        // 5. Calcola score ponderato per ogni tipologia
        const scorePerTipologia: number[] = [];
        const oggi = dataRiferimento; // Usa dataRiferimento come 'oggi'

        for (const [nomeTipologia, questionariTipo] of perTipologia.entries()) {
            // Ottieni tempo di somministrazione per questa tipologia
            const tipologia = await db.query.tipologiaQuestionario.findFirst({
                where: eq(tipologiaQuestionario.nome, nomeTipologia),
            });

            if (!tipologia) continue;

            const tempoSomministrazione = tipologia.tempoSomministrazione;

            // Calcola λ per questa tipologia
            // λ = ln(PESO_MINIMO) / (-N_CICLI_DECADIMENTO * tempoSomministrazione)
            const lambda = Math.log(PESO_MINIMO) / (-N_CICLI_DECADIMENTO * tempoSomministrazione);

            // Ordina questionari dal più recente al più vecchio
            questionariTipo.sort((a, b) => b.dataCompilazione.getTime() - a.dataCompilazione.getTime());

            // Calcola media ponderata per questa tipologia
            let sommaPonderata = 0;
            let sommaPesi = 0;

            for (const q of questionariTipo) {
                // Calcola giorni dalla data più recente (che è dataRiferimento o vicina)
                // Nota: se dataCompilazione > oggi (non dovrebbe accadere col filtro), giorni sarà negativo.
                const giorniDaUltimo = Math.floor(
                    (oggi.getTime() - q.dataCompilazione.getTime()) / (1000 * 60 * 60 * 24)
                );

                // Calcola peso con decadimento esponenziale
                let peso = Math.exp(-lambda * giorniDaUltimo);

                // Applica peso minimo
                peso = Math.max(peso, PESO_MINIMO);

                sommaPonderata += q.score * peso;
                sommaPesi += peso;
            }

            // Media ponderata per questa tipologia
            const scoreTipologia = sommaPesi > 0 ? sommaPonderata / sommaPesi : 0;
            scorePerTipologia.push(scoreTipologia);
        }

        // 6. Calcola media semplice tra tutte le tipologie
        if (scorePerTipologia.length === 0) {
            return null;
        }

        const scoreFinale = scorePerTipologia.reduce((sum, s) => sum + s, 0) / scorePerTipologia.length;

        return Math.round(scoreFinale * 100) / 100; // Arrotonda a 2 decimali
    }

    /**
     * Aggiorna lo score del paziente nel database e la priorità se necessario
     * Calcola la media e la salva nel campo score della tabella paziente
     * Poi chiama il servizio di gestione priorità
     */
    async updatePatientScore(idPaziente: string, idQuestionario: string): Promise<void> {
        const score = await this.calculatePatientScore(idPaziente);

        // Aggiorna il campo score del paziente
        await db
            .update(paziente)
            .set({ score: score })
            .where(eq(paziente.idPaziente, idPaziente));

        // Aggiorna la priorità del paziente (se necessario)
        await this.prioritaService.updatePrioritaPaziente(idPaziente, idQuestionario);
    }

    /**
     * Aggiorna SOLO lo score del paziente senza modificare la priorità
     * Usato durante il ricalcolo incrementale per evitare conflitti con cambiamento
     */
    async updatePatientScoreOnly(idPaziente: string): Promise<void> {
        const score = await this.calculatePatientScore(idPaziente);

        // Aggiorna il campo score del paziente
        await db
            .update(paziente)
            .set({ score: score })
            .where(eq(paziente.idPaziente, idPaziente));
    }

    /**
     * Ottiene lo score corrente del paziente con metadati
     */
    async getPatientScore(idPaziente: string): Promise<PatientScoreDto> {
        // Ottieni i dati del paziente
        const pazienteData = await db.query.paziente.findFirst({
            where: eq(paziente.idPaziente, idPaziente),
        });

        if (!pazienteData) {
            throw new Error(`Paziente con ID ${idPaziente} non trovato`);
        }

        // Conta il totale dei questionari compilati
        const totalResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(questionario)
            .where(eq(questionario.idPaziente, idPaziente));

        const totalQuestionari = totalResult[0]?.count || 0;

        // Verifica screening completo
        const screeningCompleto = await this.hasCompletedScreening(idPaziente);

        return {
            idPaziente: pazienteData.idPaziente,
            score: pazienteData.score,
            totalQuestionari,
            screeningCompleto,
        };
    }
}
