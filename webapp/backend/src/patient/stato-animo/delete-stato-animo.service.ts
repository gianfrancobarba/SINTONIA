import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { statoAnimo } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { DeleteStatoAnimoDto } from './dto/delete-stato-animo.dto.js';

/**
 * Service per l'eliminazione di stati d'animo esistenti
 * 
 * Responsabilità:
 * - Verifica che lo stato d'animo esista
 * - Verifica che lo stato d'animo appartenga al paziente (ownership)
 * - Eliminazione fisica dal database (hard delete)
 * - Restituzione conferma operazione
 */
@Injectable()
export class DeleteStatoAnimoService {
    /**
     * Elimina uno stato d'animo esistente del paziente
     * 
     * @param patientId ID del paziente (UUID)
     * @param statoAnimoId ID dello stato d'animo da eliminare (UUID)
     * @returns Conferma dell'eliminazione
     * @throws NotFoundException se lo stato d'animo non esiste
     * @throws ForbiddenException se lo stato d'animo non appartiene al paziente
     * @throws BadRequestException se l'eliminazione fallisce
     */
    async deleteStatoAnimo(
        patientId: string,
        statoAnimoId: string
    ): Promise<DeleteStatoAnimoDto> {
        // Verifica che lo stato d'animo esista
        const record = await db.query.statoAnimo.findFirst({
            where: eq(statoAnimo.idStatoAnimo, statoAnimoId),
        });

        if (!record) {
            throw new NotFoundException(
                `Stato d'animo con ID ${statoAnimoId} non trovato`
            );
        }

        // Verifica che lo stato d'animo appartenga al paziente
        if (record.idPaziente !== patientId) {
            throw new ForbiddenException(
                'Non sei autorizzato a eliminare questo stato d\'animo'
            );
        }

        // Eliminazione fisica dal database (hard delete)
        const result = await db
            .delete(statoAnimo)
            .where(eq(statoAnimo.idStatoAnimo, statoAnimoId));

        if (!result) {
            throw new BadRequestException('Impossibile eliminare lo stato d\'animo');
        }

        return {
            success: true,
            message: 'Stato d\'animo eliminato con successo',
        };
    }
}
