import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { report } from '../../drizzle/schema.js';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class ReportViewService {
    async getLatestReport(patientId: string) {
        const [latestReport] = await db
            .select()
            .from(report)
            .where(eq(report.idPaziente, patientId))
            .orderBy(desc(report.dataReport))
            .limit(1);

        if (!latestReport) {
            throw new NotFoundException('Nessun report trovato per questo paziente');
        }

        return latestReport;
    }
}
