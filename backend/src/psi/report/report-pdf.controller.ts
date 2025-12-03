import { Controller, Get, Param, Res, UseGuards, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { ReportPdfService } from './report-pdf.service.js';
import { ReportViewService } from './report-view.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { db } from '../../drizzle/db.js';
import { paziente } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';

@Controller('psi/report/pdf')
export class ReportPdfController {
    constructor(
        private readonly reportPdfService: ReportPdfService,
        private readonly reportViewService: ReportViewService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get(':patientId')
    async downloadPdf(@Param('patientId') patientId: string, @Res() res: Response) {
        // 1. Get Report Content
        const report = await this.reportViewService.getLatestReport(patientId);

        // 2. Get Patient Details for the filename and PDF header
        const [patientData] = await db
            .select({
                nome: paziente.nome,
                cognome: paziente.cognome
            })
            .from(paziente)
            .where(eq(paziente.idPaziente, patientId))
            .limit(1);

        if (!patientData) {
            throw new NotFoundException('Paziente non trovato');
        }

        const patientName = `${patientData.nome} ${patientData.cognome}`;

        // 3. Generate PDF
        const buffer = await this.reportPdfService.generatePdf(
            report.contenuto,
            patientName,
            new Date(report.dataReport || new Date())
        );

        // 4. Send Response
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="Report_${patientData.cognome}_${patientData.nome}.pdf"`,
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }
}
