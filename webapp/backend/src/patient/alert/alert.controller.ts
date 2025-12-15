import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AlertService } from './alert.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { AlertClinicoDto } from './dto/alert.dto.js';

@Controller('paziente/alert')
export class AlertController {
    constructor(private readonly alertService: AlertService) { }

    /**
     * Ottiene tutti gli alert del paziente autenticato
     */
    @Get()
    @UseGuards(JwtAuthGuard)
    async getAlerts(@Req() req): Promise<AlertClinicoDto[]> {
        const userId = req.user.userId;
        return this.alertService.getPatientAlerts(userId);
    }
}
