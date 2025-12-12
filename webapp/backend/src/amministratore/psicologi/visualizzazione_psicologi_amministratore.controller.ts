import { Controller, Get, UseGuards } from '@nestjs/common';
import { Visualizzazione_psicologi_amministratoreService } from './visualizzazione_psicologi_amministratore.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/psychologists')
export class Visualizzazione_psicologi_amministratoreController {
    constructor(private readonly service: Visualizzazione_psicologi_amministratoreService) { }

    /**
     * Ritorna TUTTI gli psicologi della piattaforma
     * Endpoint: GET /admin/psychologists
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async listAll() {
        return this.service.getTuttiPsicologi();
    }
}
