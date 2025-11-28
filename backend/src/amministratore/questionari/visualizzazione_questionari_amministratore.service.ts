import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { questionario } from '../../drizzle/schema.js';

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
}
