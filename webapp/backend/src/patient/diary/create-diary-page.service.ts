import { Injectable, BadRequestException } from '@nestjs/common';
import { DiaryPageDto } from './dto/diary-page.dto.js';
import { CreateDiaryPageDto } from './dto/create-diary-page.dto.js';
import { db } from '../../drizzle/db.js';
import { paginaDiario } from '../../drizzle/schema.js';
import { BadgeService } from '../badge/badge.service.js';

@Injectable()
export class CreateDiaryPageService {
    constructor(private readonly badgeService: BadgeService) { }

    /**
     * Create a new diary page for a patient
     * @param patientId - The UUID of the patient
     * @param dto - Data for the new diary page
     * @returns The created diary page
     */
    async createDiaryPage(patientId: string, dto: CreateDiaryPageDto): Promise<DiaryPageDto> {
        this.validazione(dto);

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

        // Controlla e assegna badge guadagnati
        await this.badgeService.checkAndAwardBadges(patientId);

        return {
            id: insertedPage.id,
            title: insertedPage.title,
            content: insertedPage.content,
            createdAt: insertedPage.createdAt || new Date(),
        };
    }
    validazione(dto: CreateDiaryPageDto): void {
        const dtoInstance = Object.assign(new CreateDiaryPageDto(), dto);

        if (!dtoInstance.title || dtoInstance.title.trim().length === 0) {
            throw new BadRequestException('Il titolo è obbligatorio');
        } else if (dtoInstance.title.length > 64) {
            throw new BadRequestException('Il titolo non può superare i 64 caratteri');
        }

        if (!dtoInstance.content || dtoInstance.content.trim().length === 0) {
            throw new BadRequestException('Il contenuto è obbligatorio');
        } else if (dtoInstance.content.length > 2000) {
            throw new BadRequestException('Il contenuto non può superare i 2000 caratteri');
        }
    }
}
