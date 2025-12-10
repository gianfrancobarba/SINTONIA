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
    /**
     * Valida la richiesta di revisione.
     */
    async validazione(idQuestionario: string, idPsicologo: string) {
        if (!idQuestionario) throw new Error("ID Questionario obbligatorio");
        if (!idPsicologo) throw new Error("ID Psicologo obbligatorio");

        const q = await db.select().from(questionario).where(eq(questionario.idQuestionario, idQuestionario)).limit(1);

        if (q.length === 0) {
            throw new Error(`Questionario con ID ${idQuestionario} non trovato`);
        }

        const data = q[0];

        if (data.revisionato) {
            throw new Error("Il questionario è già stato revisionato");
        }

        if (data.invalidato) {
            throw new Error("Il questionario è stato invalidato");
        }

        if (data.idPsicologoRichiedente) {
            throw new Error("È stata richiesta l'invalidazione per questo questionario");
        }
    }

    /**
     * Revisiona un questionario impostando revisionato a true
     * @param idQuestionario - ID del questionario da revisionare
     * @param idPsicologoRevisione - Codice fiscale dello psicologo che revisiona
     */
    async revisionaQuestionario(
        idQuestionario: string,
        idPsicologoRevisione: string
    ): Promise<void> {
        await this.validazione(idQuestionario, idPsicologoRevisione);

        await db
            .update(questionario)
            .set({
                revisionato: true,
                idPsicologoRevisione: idPsicologoRevisione,
            })
            .where(eq(questionario.idQuestionario, idQuestionario));
    }
}
