import { Module } from '@nestjs/common';
import { ReportController } from './report.controller.js';
import { ReportService } from './report.service.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';
import { ReportViewController } from './report-view.controller.js';
import { ReportViewService } from './report-view.service.js';
import { ReportPdfController } from './report-pdf.controller.js';
import { ReportPdfService } from './report-pdf.service.js';

@Module({
    imports: [DrizzleModule],
    controllers: [ReportController, ReportViewController, ReportPdfController],
    providers: [ReportService, ReportViewService, ReportPdfService],
})
export class ReportModule { }
