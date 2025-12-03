import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    /**
     * Get admin dashboard data
     * @param email - Email dell'amministratore
     * @returns Dati profilo amministratore (nome e cognome)
     */
    @Get('me')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async getDashboard(@Query('email') email: string) {
        if (!email) {
            throw new Error('Email amministratore richiesta');
        }
        return this.dashboardService.getDashboardData(email);
    }
}
