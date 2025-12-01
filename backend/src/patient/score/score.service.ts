import { Injectable } from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { paziente, questionario } from '../../drizzle/schema.js';
import { PatientScoreDto } from './dto/score.dto.js';

@Injectable()
export class ScoreService {
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
     * Calcola lo score del paziente come media di tutti i questionari compilati
     * Restituisce null se lo screening non è completo o non ci sono questionari
     */
    async calculatePatientScore(idPaziente: string): Promise<number | null> {
        // 1. Verifica che lo screening sia completo
        const screeningCompleto = await this.hasCompletedScreening(idPaziente);
        if (!screeningCompleto) {
            return null;
        }

        // 2. Ottieni tutti gli score dei questionari compilati
        const questionari = await db
            .select({ score: questionario.score })
            .from(questionario)
            .where(eq(questionario.idPaziente, idPaziente));

        // 3. Filtra solo gli score non null
        const scores = questionari
            .filter(q => q.score !== null)
            .map(q => q.score as number);

        if (scores.length === 0) {
            return null;
        }

        // 4. Calcola la media
        const media = scores.reduce((sum, score) => sum + score, 0) / scores.length;

        return media;
    }

    /**
     * Aggiorna lo score del paziente nel database
     * Calcola la media e la salva nel campo score della tabella paziente
     */
    async updatePatientScore(idPaziente: string): Promise<void> {
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
