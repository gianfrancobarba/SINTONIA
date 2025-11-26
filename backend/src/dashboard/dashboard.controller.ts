import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { DashboardService as AdminDashboardService } from '../amministratore/dashboard/dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly adminDashboardService: AdminDashboardService) { }

    @Get()
    async getDashboard(@Query('email') email: string, @Query('role') role: string) {
        // TODO: Replace Query params with actual AuthGuard and @User() decorator when available.
        // This is a skeleton implementation to demonstrate the logic switching.

        if (!email) {
            throw new BadRequestException('Email is required for this skeleton endpoint');
        }

        // Logic to switch between Admin and Psychologist dashboards
        if (role === 'admin') {
            return this.adminDashboardService.getDashboardData(email);
        } else if (role === 'psychologist') {}

    }
}
