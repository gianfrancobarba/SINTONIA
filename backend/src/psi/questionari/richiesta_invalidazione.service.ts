import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { questionario } from '../../drizzle/schema.js';

@Injectable()
export class RichiestaInvalidazioneService {
    async richiestaInvalidazione(
        idQuestionario: string,
        idPsicologo: string,
        note: string,
    ) {
        // 1. Verifica che il questionario esista
        const existingQuestionnaire = await db
            .select()
            .from(questionario)
            .where(eq(questionario.idQuestionario, idQuestionario))
            .limit(1);

        if (existingQuestionnaire.length === 0) {
            throw new NotFoundException(
                `Questionario con ID ${idQuestionario} non trovato`,
            );
        }

        const quest = existingQuestionnaire[0];

        // 2. Verifica che il questionario non sia già invalidato
        if (quest.invalidato) {
            throw new BadRequestException(
                'Il questionario è già stato invalidato',
            );
        }

        // 3. Verifica che non ci sia già stata una richiesta di invalidazione
        // Una volta fatta una richiesta (anche se rifiutata), non si può più richiedere
        if (quest.idPsicologoRichiedente) {
            throw new BadRequestException(
                'È già stata effettuata una richiesta di invalidazione per questo questionario',
            );
        }

        // 4. Aggiorna il questionario con la richiesta di invalidazione
        await db
            .update(questionario)
            .set({
                idPsicologoRichiedente: idPsicologo,
                noteInvalidazione: note,
                dataInvalidazione: new Date(),
            })
            .where(eq(questionario.idQuestionario, idQuestionario));

        return {
            success: true,
            message: 'Richiesta di invalidazione inviata con successo',
        };
    }
}
