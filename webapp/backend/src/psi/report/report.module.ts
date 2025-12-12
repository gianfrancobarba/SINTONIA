import { Module } from '@nestjs/common';
import { ReportController } from './report.controller.js';
import { ReportService } from './report.service.js';
import { ReportViewController } from './report-view.controller.js';
import { ReportViewService } from './report-view.service.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

@Module({
    imports: [DrizzleModule],
    controllers: [ReportController, ReportViewController],
    providers: [ReportService, ReportViewService],
})
export class ReportModule { }

