import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { domandaForum, rispostaForum } from '../../drizzle/schema.js';
import { ModificaDomandaDto, DomandaModificataDto } from './dto/modifica_domanda.dto.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class ModificaDomandaService {
    /**
     * Modifica una domanda esistente nel forum
     * @param idDomanda - UUID della domanda da modificare
     * @param idPaziente - ID del paziente che richiede la modifica
     * @param dto - Campi da modificare (titolo, testo, categoria)
     * @returns Conferma modifica
     */
    async modificaDomanda(
        idDomanda: string,
        idPaziente: string,
        dto: ModificaDomandaDto
    ): Promise<DomandaModificataDto> {
        // Crea istanza della classe e copia proprietà
        const dtoInstance = Object.assign(new ModificaDomandaDto(), dto);

        // Validazione DTO
        const validationErrors = dtoInstance.validate();
        if (validationErrors.length > 0) {
            throw new BadRequestException(validationErrors.join(', '));
        }

        // Verifica che la domanda esista
        const domanda = await db.query.domandaForum.findFirst({
            where: eq(domandaForum.idDomanda, idDomanda),
        });

        if (!domanda) {
            throw new NotFoundException(`Domanda con ID ${idDomanda} non trovata`);
        }

        // Verifica che il paziente sia l'autore della domanda
        if (domanda.idPaziente !== idPaziente) {
            throw new ForbiddenException('Non sei autorizzato a modificare questa domanda');
        }

        // Verifica che la domanda non abbia già risposte
        const risposte = await db
            .select()
            .from(rispostaForum)
            .where(eq(rispostaForum.idDomanda, idDomanda))
            .limit(1);

        if (risposte.length > 0) {
            throw new ForbiddenException('Non è possibile modificare una domanda che ha già ricevuto risposte');
        }

        // Prepara i valori da aggiornare (solo i campi presenti nel DTO)
        const updateValues: any = {};
        if (dto.titolo !== undefined) updateValues.titolo = dto.titolo.trim();
        if (dto.testo !== undefined) updateValues.testo = dto.testo.trim();
        if (dto.categoria !== undefined) updateValues.categoria = dto.categoria.trim();

        // Esegui l'aggiornamento
        await db
            .update(domandaForum)
            .set(updateValues)
            .where(eq(domandaForum.idDomanda, idDomanda));

        return {
            success: true,
            message: 'Domanda modificata con successo',
        };
    }
}
