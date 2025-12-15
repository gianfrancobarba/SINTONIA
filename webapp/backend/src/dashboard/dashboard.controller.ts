import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { DashboardService as AdminDashboardService } from '../amministratore/dashboard/dashboard.service.js';
import { DashboardService as PsychologistDashboardService } from '../psi/dashboard/dashboard.service.js';

@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly adminDashboardService: AdminDashboardService,
        private readonly psychologistDashboardService: PsychologistDashboardService,
    ) { }


    @Get()
    async getDashboard(
        @Query('role') role: string,
        @Query('email') email?: string,
        @Query('codiceFiscale') codiceFiscale?: string,
    ) {
        if (role === 'admin') {
            if (!email) {
                throw new BadRequestException('email is required when role=admin');
            }
            return this.adminDashboardService.getDashboardData(email);
        } else if (role === 'psychologist') {
            if (!codiceFiscale) {
                throw new BadRequestException('codiceFiscale is required when role=psychologist');
            }
            return this.psychologistDashboardService.getDashboardData(codiceFiscale);
        }

        throw new BadRequestException("invalid 'role' query param. Expected 'admin' or 'psychologist'");
    }
}
