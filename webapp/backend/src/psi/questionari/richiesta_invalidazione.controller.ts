import { Controller, Post, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { RichiestaInvalidazioneService } from './richiesta_invalidazione.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/questionnaires')
export class RichiestaInvalidazioneController {
    constructor(private readonly service: RichiestaInvalidazioneService) { }

    /**
     * Richiede l'invalidazione di un questionario
     * Endpoint: POST /psi/questionnaires/:id/request-invalidation
     * @param id - ID del questionario
     * @param cf - Codice fiscale dello psicologo (query param)
     * @param body - Contiene le note della richiesta
     */
    @Post(':id/request-invalidation')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async richiestaInvalidazione(
        @Param('id') id: string,
        @Query('cf') cf: string,
        @Body('notes') notes: string
    ) {
        await this.service.richiestaInvalidazione(id, cf, notes);
        return { message: 'Richiesta di invalidazione inviata con successo' };
    }
}
