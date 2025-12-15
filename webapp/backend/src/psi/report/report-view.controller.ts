import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReportViewService } from './report-view.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';

@Controller('psi/report/view')
export class ReportViewController {
    constructor(private readonly reportViewService: ReportViewService) { }

    @UseGuards(JwtAuthGuard)
    @Get(':patientId')
    async getReport(@Param('patientId') patientId: string) {
        return this.reportViewService.getLatestReport(patientId);
    }
}
