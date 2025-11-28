import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { questionario } from '../../drizzle/schema.js';

@Injectable()
export class AnnullamentoRevisioneService {
    /**
     * Annulla la revisione di un questionario impostando revisionato a false
     * @param idQuestionario - ID del questionario da modificare
     */
    async annullaRevisione(idQuestionario: string): Promise<void> {
        await db
            .update(questionario)
            .set({
                revisionato: false,
                idPsicologoRevisione: null, // Rimuove anche il riferimento allo psicologo che aveva revisionato
            })
            .where(eq(questionario.idQuestionario, idQuestionario));
    }
}
