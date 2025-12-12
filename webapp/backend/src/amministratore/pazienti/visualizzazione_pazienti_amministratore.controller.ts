import { Controller, Get, UseGuards } from '@nestjs/common';
import { Visualizzazione_pazienti_amministratoreService } from './visualizzazione_pazienti_amministratore.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/patients')
export class Visualizzazione_pazienti_amministratoreController {
    constructor(private readonly service: Visualizzazione_pazienti_amministratoreService) { }

    /**
     * Ritorna TUTTI i pazienti della piattaforma
     * Endpoint: GET /admin/patients
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async listAll() {
        return this.service.getTuttiPazienti();
    }
}
