import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { questionario } from '../../drizzle/schema.js';

@Injectable()
export class Rifiuto_invalidazioneService {
    /**
     * Rifiuta una richiesta di invalidazione salvando l'amministratore e la data
     * ma lasciando invalidato = false
     * @param idQuestionario - ID del questionario
     * @param emailAmministratore - Email dell'amministratore che rifiuta l'invalidazione
     */
    async rifiutaRichiestaInvalidazione(
        idQuestionario: string,
        emailAmministratore: string,
    ): Promise<void> {
        await db
            .update(questionario)
            .set({
                dataInvalidazione: new Date(),
                idAmministratoreConferma: emailAmministratore,
                // invalidato rimane false per indicare il rifiuto
            })
            .where(eq(questionario.idQuestionario, idQuestionario));
    }
}
