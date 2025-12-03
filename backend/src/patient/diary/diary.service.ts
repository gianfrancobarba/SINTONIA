import { Injectable } from '@nestjs/common';
import { DiaryPageDto } from './dto/diary-page.dto.js';
import { LastDiaryPageDto } from './dto/last-diary-page.dto.js';
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


    /**
     * Get the last diary page for a specific patient
     * @param patientId - The UUID of the patient
     * @returns The last diary page or null
     */
    async getLastDiaryPage(patientId: string): Promise<LastDiaryPageDto | null> {
        const rows = await db
            .select({
                idPaginaDiario: paginaDiario.idPaginaDiario,
                titolo: paginaDiario.titolo,
                testo: paginaDiario.testo,
                dataInserimento: paginaDiario.dataInserimento,
            })
            .from(paginaDiario)
            .where(eq(paginaDiario.idPaziente, patientId))
            .orderBy(desc(paginaDiario.dataInserimento))
            .limit(1);

        if (rows.length === 0) {
            return null;
        }

        const pagina = rows[0];
        const testoAnteprima = this.createPreview(pagina.testo, 100);
        const dataInserimento = pagina.dataInserimento ? new Date(pagina.dataInserimento) : new Date();
        const dataFormattata = this.formatDisplayDate(dataInserimento);

        return {
            idPaginaDiario: pagina.idPaginaDiario,
            titolo: pagina.titolo,
            testoAnteprima,
            dataInserimento,
            dataFormattata,
        };
    }

    /**
     * Create a preview of the text limited to maxLength characters
     */
    private createPreview(text: string, maxLength: number): string {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }

    /**
     * Format a date in dd/MM format for display
     */
    private formatDisplayDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    }
}

