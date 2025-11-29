import { Injectable } from '@nestjs/common';
import { DiaryPageDto } from './dto/diary-page.dto.js';
import { db } from '../../drizzle/db.js';
import { paginaDiario } from '../../drizzle/schema.js';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class DiaryService {
    /**
     * Get all diary pages for a specific patient, ordered by date (most recent first)
     * @param patientId - The UUID of the patient
     * @returns Array of diary pages
     */
    async getDiaryPages(patientId: string): Promise<DiaryPageDto[]> {
        const pages = await db
            .select({
                id: paginaDiario.idPaginaDiario,
                title: paginaDiario.titolo,
                content: paginaDiario.testo,
                createdAt: paginaDiario.dataInserimento,
            })
            .from(paginaDiario)
            .where(eq(paginaDiario.idPaziente, patientId))
            .orderBy(desc(paginaDiario.dataInserimento));

        return pages.map(page => ({
            id: page.id,
            title: page.title,
            content: page.content,
            createdAt: page.createdAt || new Date(),
        }));
    }
}

