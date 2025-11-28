import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { questionario } from '../../drizzle/schema.js';

@Injectable()
export class RichiestaInvalidazioneService {
    /**
     * Richiede l'invalidazione di un questionario
     * Imposta l'ID dello psicologo richiedente e salva le note
     * @param idQuestionario - ID del questionario da invalidare
     * @param idPsicologoRichiedente - Codice fiscale dello psicologo che richiede l'invalidazione
     * @param note - Note sulla richiesta di invalidazione
     */
    async richiestaInvalidazione(
        idQuestionario: string,
        idPsicologoRichiedente: string,
        note: string
    ): Promise<void> {
        await db
            .update(questionario)
            .set({
                idPsicologoRichiedente: idPsicologoRichiedente,
                noteInvalidazione: note,
            })
            .where(eq(questionario.idQuestionario, idQuestionario));
    }
}
