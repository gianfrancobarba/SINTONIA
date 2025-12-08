import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { questionario } from '../../drizzle/schema.js';
import { NotificationHelperService } from '../../notifications/notification-helper.service.js';

@Injectable()
export class Rifiuto_invalidazioneService {
    constructor(private readonly notificationHelper: NotificationHelperService) { }

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
        // 1. Recupera il questionario per ottenere lo psicologo richiedente
        const quest = await db.query.questionario.findFirst({
            where: eq(questionario.idQuestionario, idQuestionario)
        });

        // 2. Aggiorna il questionario
        await db
            .update(questionario)
            .set({
                dataInvalidazione: new Date(),
                idAmministratoreConferma: emailAmministratore,
                // invalidato rimane false per indicare il rifiuto
            })
            .where(eq(questionario.idQuestionario, idQuestionario));

        // 3. Notifica lo psicologo che ha richiesto l'invalidazione
        if (quest?.idPsicologoRichiedente) {
            await this.notificationHelper.notifyPsicologo(
                quest.idPsicologoRichiedente,
                'Richiesta di invalidazione rifiutata',
                'La tua richiesta di invalidazione questionario è stata rifiutata.',
                'INVALIDAZIONE',
            );
        }
    }
}
