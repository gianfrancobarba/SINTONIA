import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { questionario, tipologiaQuestionario } from '../../drizzle/schema.js';

@Injectable()
export class Visualizzazione_questionari_amministratoreService {
    /**
     * Restituisce TUTTI i questionari di tutti i pazienti (inclusi quelli invalidati)
     */
    async getTuttiQuestionari() {
        const rows = await db
            .select({
                idQuestionario: questionario.idQuestionario,
                idPaziente: questionario.idPaziente,
                nomeTipologia: questionario.nomeTipologia,
                score: questionario.score,
                risposte: questionario.risposte,
                cambiamento: questionario.cambiamento,
                dataCompilazione: questionario.dataCompilazione,
                revisionato: questionario.revisionato,
                invalidato: questionario.invalidato,
                noteInvalidazione: questionario.noteInvalidazione,
                dataInvalidazione: questionario.dataInvalidazione,
                idPsicologoRevisione: questionario.idPsicologoRevisione,
                idPsicologoRichiedente: questionario.idPsicologoRichiedente,
                idAmministratoreConferma: questionario.idAmministratoreConferma,
            })
            .from(questionario);

        return rows;
    }

    /**
     * Restituisce TUTTI i questionari di uno specifico paziente, inclusi quelli invalidati.
     */
    async getQuestionariByPaziente(idPaziente: string) {
        const rows = await db
            .select({
                idQuestionario: questionario.idQuestionario,
                idPaziente: questionario.idPaziente,
                nomeTipologia: questionario.nomeTipologia,
                score: questionario.score,
                risposte: questionario.risposte,
                cambiamento: questionario.cambiamento,
                dataCompilazione: questionario.dataCompilazione,
                revisionato: questionario.revisionato,
                invalidato: questionario.invalidato,
                noteInvalidazione: questionario.noteInvalidazione,
                dataInvalidazione: questionario.dataInvalidazione,
                idPsicologoRevisione: questionario.idPsicologoRevisione,
                idPsicologoRichiedente: questionario.idPsicologoRichiedente,
                idAmministratoreConferma: questionario.idAmministratoreConferma,
            })
            .from(questionario)
            .where(eq(questionario.idPaziente, idPaziente));

        return rows;
    }

    /**
     * Ottieni dettaglio completo di un questionario singolo con domande e risposte
     */
    async getQuestionarioById(id: string) {
        // Get questionnaire
        const result = await db.query.questionario.findFirst({
            where: eq(questionario.idQuestionario, id),
        });

        if (!result) {
            throw new NotFoundException(`Questionario con ID ${id} non trovato`);
        }

        // Get tipologia data
        const tipologia = await db.query.tipologiaQuestionario.findFirst({
            where: eq(tipologiaQuestionario.nome, result.nomeTipologia),
        });

        if (!tipologia) {
            throw new NotFoundException(`Tipologia questionario ${result.nomeTipologia} non trovata`);
        }

        // Parse domande and campi from string to arrays
        const parseDomandeOCampi = (data: any): string[] => {
            if (!data) return [];
            if (Array.isArray(data)) return data;
            if (typeof data === 'string') {
                return data.split(';').map(item => item.trim()).filter(item => item.length > 0);
            }
            return [String(data)];
        };

        // Return complete data
        return {
            idQuestionario: result.idQuestionario,
            idPaziente: result.idPaziente,
            nomeTipologia: result.nomeTipologia,
            score: result.score,
            risposte: result.risposte,
            campi: parseDomandeOCampi(tipologia.campi),
            cambiamento: result.cambiamento ?? false,
            dataCompilazione: result.dataCompilazione.toISOString(),
            revisionato: result.revisionato ?? false,
            invalidato: result.invalidato ?? false,
            noteInvalidazione: result.noteInvalidazione,
            dataInvalidazione: result.dataInvalidazione?.toISOString() ?? null,
            idPsicologoRevisione: result.idPsicologoRevisione,
            idPsicologoRichiedente: result.idPsicologoRichiedente,
            idAmministratoreConferma: result.idAmministratoreConferma,
            domande: parseDomandeOCampi(tipologia.domande),
        };
    }
}
