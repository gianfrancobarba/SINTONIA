import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DiaryPageDto } from './dto/diary-page.dto.js';
import { UpdateDiaryPageDto } from './dto/update-diary-page.dto.js';
import { db } from '../../drizzle/db.js';
import { paginaDiario } from '../../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class UpdateDiaryPageService {
    /**
     * Update an existing diary page for a patient
     * @param patientId - The UUID of the patient
     * @param pageId - The UUID of the diary page to update
     * @param dto - Updated data for the diary page
     * @returns The updated diary page
     */
    async updateDiaryPage(patientId: string, pageId: string, dto: UpdateDiaryPageDto): Promise<DiaryPageDto> {
        // Create DTO instance and validate
        const dtoInstance = Object.assign(new UpdateDiaryPageDto(), dto);
        const validationErrors = dtoInstance.validate();

        if (validationErrors.length > 0) {
            throw new BadRequestException({
                message: 'Errore di validazione',
                errors: validationErrors,
            });
        }

        // Check if the page exists and belongs to the patient
        const existingPage = await db
            .select()
            .from(paginaDiario)
            .where(and(
                eq(paginaDiario.idPaginaDiario, pageId),
                eq(paginaDiario.idPaziente, patientId)
            ))
            .limit(1);

        if (!existingPage || existingPage.length === 0) {
            throw new NotFoundException('Pagina del diario non trovata');
        }

        // Update the diary page
        const [updatedPage] = await db
            .update(paginaDiario)
            .set({
                titolo: dto.title.trim(),
                testo: dto.content.trim(),
            })
            .where(eq(paginaDiario.idPaginaDiario, pageId))
            .returning({
                id: paginaDiario.idPaginaDiario,
                title: paginaDiario.titolo,
                content: paginaDiario.testo,
                createdAt: paginaDiario.dataInserimento,
            });

        if (!updatedPage) {
            throw new BadRequestException('Impossibile aggiornare la pagina del diario');
        }

        return {
            id: updatedPage.id,
            title: updatedPage.title,
            content: updatedPage.content,
            createdAt: updatedPage.createdAt || new Date(),
        };
    }
}
