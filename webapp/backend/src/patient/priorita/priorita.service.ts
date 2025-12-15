import { Injectable } from '@nestjs/common';
import { eq, and, gte, lte } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { paziente, questionario, priorita } from '../../drizzle/schema.js';
import { PatientPrioritaDto } from './dto/priorita.dto.js';

@Injectable()
export class PrioritaService {
    // Ordine delle priorità (dal più urgente al meno urgente)
    private readonly ORDINE_PRIORITA = ['Urgente', 'Breve', 'Differibile', 'Programmabile'];

    /**
     * Determina la priorità basandosi sullo score
     * Query alla tabella priorita per trovare la fascia corretta
     */
    async determinaPriorita(score: number): Promise<string> {
        // Trova la priorità che contiene questo score
        const prioritaRow = await db
            .select({ nome: priorita.nome })
            .from(priorita)
            .where(
                and(
                    gte(priorita.punteggioFine, score),
                    lte(priorita.punteggioInizio, score)
                )
            )
            .limit(1);

        if (!prioritaRow.length) {
            // Fallback: se score non rientra in nessuna fascia, usa Programmabile
            return 'Programmabile';
        }

        return prioritaRow[0].nome;
    }

    /**
     * Compara due priorità
     * @returns -1 se p1 < p2, 0 se uguali, 1 se p1 > p2 (p1 più urgente)
     */
    comparePriorita(priorita1: string, priorita2: string): number {
        const index1 = this.ORDINE_PRIORITA.indexOf(priorita1);
        const index2 = this.ORDINE_PRIORITA.indexOf(priorita2);

        if (index1 < index2) return 1;  // priorita1 è più urgente
        if (index1 > index2) return -1; // priorita1 è meno urgente
        return 0; // Uguali
    }

    /**
     * Ottiene la fascia di score per una priorità
     */
    async getFasciaPriorita(nomePriorita: string): Promise<{
        punteggioInizio: number;
        punteggioFine: number;
    }> {
        const fascia = await db.query.priorita.findFirst({
            where: eq(priorita.nome, nomePriorita as any),
        });

        if (!fascia) {
            throw new Error(`Priorità ${nomePriorita} non trovata`);
        }

        return {
            punteggioInizio: fascia.punteggioInizio,
            punteggioFine: fascia.punteggioFine,
        };
    }

    /**
     * Aggiorna la priorità del paziente se necessario
     * Logica:
     * - Se priorità aumenta → Aggiorna paziente e imposta cambiamento nel questionario
     * - Se priorità resta uguale o diminuisce → Non fa nulla
     */
    async updatePrioritaPaziente(idPaziente: string, idQuestionario: string): Promise<void> {
        // 1. Ottieni dati paziente
        const pazienteData = await db.query.paziente.findFirst({
            where: eq(paziente.idPaziente, idPaziente),
        });

        if (!pazienteData) {
            throw new Error(`Paziente con ID ${idPaziente} non trovato`);
        }

        const score = pazienteData.score;
        if (score === null || score === undefined) {
            // Score non ancora calcolato, non aggiornare priorità
            return;
        }

        // 2. Determina nuova priorità basata sullo score
        const nuovaPriorita = await this.determinaPriorita(score);

        // 3. Confronta con priorità attuale
        const prioritaAttuale = pazienteData.idPriorita;
        const confronto = this.comparePriorita(nuovaPriorita, prioritaAttuale);

        // 4. Aggiorna SOLO se priorità aumenta (confronto > 0)
        if (confronto > 0) {
            // Aggiorna priorità del paziente
            await db
                .update(paziente)
                .set({ idPriorita: nuovaPriorita as any })
                .where(eq(paziente.idPaziente, idPaziente));

            // Imposta flag cambiamento nel questionario che ha scatenato l'aumento
            await db
                .update(questionario)
                .set({ cambiamento: true })
                .where(eq(questionario.idQuestionario, idQuestionario));

            console.log(`Priorità paziente ${idPaziente} aumentata da ${prioritaAttuale} a ${nuovaPriorita}`);
        }
    }

    /**
     * Ottiene la priorità corrente del paziente con metadati
     */
    async getPatientPriorita(idPaziente: string): Promise<PatientPrioritaDto> {
        const pazienteData = await db.query.paziente.findFirst({
            where: eq(paziente.idPaziente, idPaziente),
        });

        if (!pazienteData) {
            throw new Error(`Paziente con ID ${idPaziente} non trovato`);
        }

        // Verifica se c'è stato un cambiamento recente
        const questionariConCambiamento = await db
            .select({ count: questionario.idQuestionario })
            .from(questionario)
            .where(
                and(
                    eq(questionario.idPaziente, idPaziente),
                    eq(questionario.cambiamento, true)
                )
            )
            .limit(1);

        const cambiamentoPriorita = questionariConCambiamento.length > 0;

        return {
            idPaziente: pazienteData.idPaziente,
            prioritaCorrente: pazienteData.idPriorita as any,
            score: pazienteData.score,
            cambiamentoPriorita,
        };
    }
}
