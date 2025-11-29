import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { questionario } from '../../drizzle/schema.js';

@Injectable()
export class Accettazione_invalidazioneService {
    /**
     * Accetta una richiesta di invalidazione impostando i relativi campi nel questionario
     * @param idQuestionario - ID del questionario da invalidare
     * @param emailAmministratore - Email dell'amministratore che conferma l'invalidazione
     */
    async accettaRichiestaInvalidazione(
        idQuestionario: string,
        emailAmministratore: string,
    ): Promise<void> {
        await db
            .update(questionario)
            .set({
                invalidato: true,
                dataInvalidazione: new Date(),
                idAmministratoreConferma: emailAmministratore,
            })
            .where(eq(questionario.idQuestionario, idQuestionario));
    }
}
