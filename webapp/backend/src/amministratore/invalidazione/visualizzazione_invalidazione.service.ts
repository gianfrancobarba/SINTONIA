import { Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { questionario, psicologo } from '../../drizzle/schema.js';
import { eq, isNotNull, and } from 'drizzle-orm';

@Injectable()
export class Visualizzazione_invalidazioneService {
    /**
     * Restituisce tutte le richieste di invalidazione
     * Una richiesta esiste quando idPsicologoRichiedente è NOT NULL
     */
    async getRichiesteInvalidazione() {
        const rows = await db
            .select({
                idQuestionario: questionario.idQuestionario,
                nomeTipologia: questionario.nomeTipologia,
                idPsicologoRichiedente: questionario.idPsicologoRichiedente,
                noteInvalidazione: questionario.noteInvalidazione,
                dataInvalidazione: questionario.dataInvalidazione,
                invalidato: questionario.invalidato,
                idAmministratoreConferma: questionario.idAmministratoreConferma,
                // Informazioni psicologo richiedente
                nomePsicologo: psicologo.nome,
                cognomePsicologo: psicologo.cognome,
            })
            .from(questionario)
            .leftJoin(psicologo, eq(questionario.idPsicologoRichiedente, psicologo.codFiscale))
            .where(
                and(
                    isNotNull(questionario.idPsicologoRichiedente),
                    isNotNull(questionario.noteInvalidazione)
                )
            );

        // Formatta i risultati per il frontend
        return rows.map(row => {
            // Determina lo stato della richiesta
            let stato: 'pending' | 'approved' | 'rejected';

            if (row.invalidato === true) {
                // Se invalidato è true, la richiesta è stata approvata
                stato = 'approved';
            } else if (row.idAmministratoreConferma !== null) {
                // Se c'è un amministratore ma invalidato è false, è stata rifiutata
                stato = 'rejected';
            } else {
                // Altrimenti è in attesa
                stato = 'pending';
            }

            return {
                idRichiesta: row.idQuestionario, // Usiamo l'ID questionario come ID richiesta
                idQuestionario: row.idQuestionario,
                nomeQuestionario: row.nomeTipologia,
                idPsicologoRichiedente: row.idPsicologoRichiedente,
                nomePsicologoRichiedente: row.nomePsicologo && row.cognomePsicologo
                    ? `Dr. ${row.nomePsicologo} ${row.cognomePsicologo}`
                    : row.idPsicologoRichiedente || 'Sconosciuto',
                stato,
                note: row.noteInvalidazione || '',
                dataRichiesta: row.dataInvalidazione,
            };
        });
    }
}
