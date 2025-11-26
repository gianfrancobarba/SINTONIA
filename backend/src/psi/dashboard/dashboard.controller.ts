import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { PsiDashboardResponseDto } from '../dto/psi-dashboard.dto.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/dashboard')
export class DashboardController {
    constructor(private readonly DashboardService: DashboardService) { }

    /**
     * Endpoint per recuperare i dati della sidebar dello psicologo
     *
     * @param codiceFiscale
     * @returns Dati dashboard con profilo e contatori notifiche
     */
    @Get('me')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async getDashboard(
        @Query('cf') codiceFiscale: string,
    ): Promise<PsiDashboardResponseDto> {
        console.log("test" , codiceFiscale);
        return this.DashboardService.getDashboardData(codiceFiscale);
    }
}