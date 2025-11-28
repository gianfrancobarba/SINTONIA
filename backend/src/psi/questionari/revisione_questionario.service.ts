import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { questionario } from '../../drizzle/schema.js';

@Injectable()
export class RevisioneQuestionarioService {
    /**
     * Revisiona un questionario impostando revisionato a true
     * @param idQuestionario - ID del questionario da revisionare
     * @param idPsicologoRevisione - Codice fiscale dello psicologo che revisiona
     */
    async revisionaQuestionario(
        idQuestionario: string,
        idPsicologoRevisione: string
    ): Promise<void> {
        await db
            .update(questionario)
            .set({
                revisionato: true,
                idPsicologoRevisione: idPsicologoRevisione,
            })
            .where(eq(questionario.idQuestionario, idQuestionario));
    }
}
