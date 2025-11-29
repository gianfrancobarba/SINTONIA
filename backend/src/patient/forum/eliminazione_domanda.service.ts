import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { domandaForum, rispostaForum } from '../../drizzle/schema.js';
import { DomandaEliminataDto } from './dto/eliminazione_domanda.dto.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class EliminazioneDomandaService {
    /**
     * Elimina una domanda dal forum
     * @param idDomanda - UUID della domanda da eliminare
     * @param idPaziente - ID del paziente che richiede l'eliminazione
     * @returns Conferma eliminazione
     */
    async eliminaDomanda(
        idDomanda: string,
        idPaziente: string
    ): Promise<DomandaEliminataDto> {
        // Verifica che la domanda esista
        const domanda = await db.query.domandaForum.findFirst({
            where: eq(domandaForum.idDomanda, idDomanda),
        });

        if (!domanda) {
            throw new NotFoundException(`Domanda con ID ${idDomanda} non trovata`);
        }

        // Verifica che il paziente sia l'autore della domanda
        if (domanda.idPaziente !== idPaziente) {
            throw new ForbiddenException('Non sei autorizzato a eliminare questa domanda');
        }

        // Verifica che la domanda non abbia già risposte
        const risposte = await db
            .select()
            .from(rispostaForum)
            .where(eq(rispostaForum.idDomanda, idDomanda))
            .limit(1);

        if (risposte.length > 0) {
            throw new ForbiddenException('Non è possibile eliminare una domanda che ha già ricevuto risposte');
        }

        // Hard delete dalla tabella
        await db
            .delete(domandaForum)
            .where(eq(domandaForum.idDomanda, idDomanda));

        return {
            success: true,
            message: 'Domanda eliminata con successo',
        };
    }
}
