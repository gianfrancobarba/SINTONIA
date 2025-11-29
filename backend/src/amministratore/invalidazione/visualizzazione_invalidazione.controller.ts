import { Controller, Get, UseGuards } from '@nestjs/common';
import { Visualizzazione_invalidazioneService } from './visualizzazione_invalidazione.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/invalidation-requests')
export class Visualizzazione_invalidazioneController {
    constructor(private readonly service: Visualizzazione_invalidazioneService) { }

    /**
     * Ritorna tutte le richieste di invalidazione
     * Endpoint: GET /admin/invalidation-requests
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async listAll() {
        return this.service.getRichiesteInvalidazione();
    }
}
