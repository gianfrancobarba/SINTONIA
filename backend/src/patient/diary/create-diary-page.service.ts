import { Injectable, BadRequestException } from '@nestjs/common';
import { DiaryPageDto } from './dto/diary-page.dto.js';
import { CreateDiaryPageDto } from './dto/create-diary-page.dto.js';
import { db } from '../../drizzle/db.js';
import { paginaDiario } from '../../drizzle/schema.js';

@Injectable()
export class CreateDiaryPageService {
    /**
     * Create a new diary page for a patient
     * @param patientId - The UUID of the patient
     * @param dto - Data for the new diary page
     * @returns The created diary page
     */
    async createDiaryPage(patientId: string, dto: CreateDiaryPageDto): Promise<DiaryPageDto> {
        // Create DTO instance and validate
        const dtoInstance = Object.assign(new CreateDiaryPageDto(), dto);
        const validationErrors = dtoInstance.validate();

        if (validationErrors.length > 0) {
            throw new BadRequestException({
                message: 'Errore di validazione',
                errors: validationErrors,
            });
        }

        // Insert the new diary page
        const [insertedPage] = await db
            .insert(paginaDiario)
            .values({
                titolo: dto.title.trim(),
                testo: dto.content.trim(),
                idPaziente: patientId,
            })
            .returning({
                id: paginaDiario.idPaginaDiario,
                title: paginaDiario.titolo,
                content: paginaDiario.testo,
                createdAt: paginaDiario.dataInserimento,
            });

        if (!insertedPage) {
            throw new BadRequestException('Impossibile creare la pagina del diario');
        }

        return {
            id: insertedPage.id,
            title: insertedPage.title,
            content: insertedPage.content,
            createdAt: insertedPage.createdAt || new Date(),
        };
    }
}
