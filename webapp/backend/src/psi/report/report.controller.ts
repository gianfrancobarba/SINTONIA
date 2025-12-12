import { Controller, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';

@Controller('psi/report')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @UseGuards(JwtAuthGuard)
    @Post('generate/:patientId')
    async generateReport(
        @Param('patientId') patientId: string,
        @Query('cf') psychologistId: string,
    ) {
        return this.reportService.generateReport(patientId, psychologistId);
    }
}
