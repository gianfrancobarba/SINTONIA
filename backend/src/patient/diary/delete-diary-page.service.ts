import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paginaDiario } from '../../drizzle/schema.js';
import { DeleteDiaryPageDto } from './dto/delete-diary-page.dto.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class DeleteDiaryPageService {
    /**
     * Delete a diary page
     * @param patientId - ID of the patient requesting deletion
     * @param pageId - UUID of the diary page to delete
     * @returns Confirmation of deletion
     */
    async deleteDiaryPage(
        patientId: string,
        pageId: string
    ): Promise<DeleteDiaryPageDto> {
        // Check if the page exists
        const page = await db.query.paginaDiario.findFirst({
            where: eq(paginaDiario.idPaginaDiario, pageId),
        });

        if (!page) {
            throw new NotFoundException(`Pagina del diario con ID ${pageId} non trovata`);
        }

        // Verify that the patient is the author of the page
        if (page.idPaziente !== patientId) {
            throw new ForbiddenException('Non sei autorizzato a eliminare questa pagina del diario');
        }

        // Hard delete from the table
        const result = await db
            .delete(paginaDiario)
            .where(eq(paginaDiario.idPaginaDiario, pageId));

        if (!result) {
            throw new BadRequestException('Impossibile eliminare la pagina del diario');
        }

        return {
            success: true,
            message: 'Pagina del diario eliminata con successo',
        };
    }
}
