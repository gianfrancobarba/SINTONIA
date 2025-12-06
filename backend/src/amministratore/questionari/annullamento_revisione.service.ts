import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { questionario } from '../../drizzle/schema.js';
import { NotificationHelperService } from '../../notifications/notification-helper.service.js';

@Injectable()
export class AnnullamentoRevisioneService {
    constructor(private readonly notificationHelper: NotificationHelperService) { }

    /**
     * Annulla la revisione di un questionario impostando revisionato a false
     * @param idQuestionario - ID del questionario da modificare
     */
    async annullaRevisione(idQuestionario: string): Promise<void> {
        // 1. Recupera il questionario per ottenere lo psicologo che aveva revisionato
        const quest = await db.query.questionario.findFirst({
            where: eq(questionario.idQuestionario, idQuestionario)
        });

        const idPsicologoRevisione = quest?.idPsicologoRevisione;

        // 2. Annulla la revisione
        await db
            .update(questionario)
            .set({
                revisionato: false,
                idPsicologoRevisione: null, // Rimuove anche il riferimento allo psicologo che aveva revisionato
            })
            .where(eq(questionario.idQuestionario, idQuestionario));

        // 3. Notifica lo psicologo che aveva revisionato
        if (idPsicologoRevisione) {
            await this.notificationHelper.notifyPsicologo(
                idPsicologoRevisione,
                'Revisione questionario annullata',
                'Un amministratore ha annullato la tua revisione di un questionario.',
                'QUESTIONARIO',
            );
        }
    }
}
