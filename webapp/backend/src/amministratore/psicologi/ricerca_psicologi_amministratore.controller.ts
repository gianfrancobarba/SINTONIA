import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { Ricerca_psicologi_amministratoreService } from './ricerca_psicologi_amministratore.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/psychologists/search')
export class Ricerca_psicologi_amministratoreController {
    constructor(private readonly service: Ricerca_psicologi_amministratoreService) { }

    /**
     * Cerca psicologo per codice fiscale (esatto) o per nome/cognome (parziale)
     * Endpoint: GET /admin/psychologists/search?codFiscale=XXX
     * oppure: GET /admin/psychologists/search?q=mario
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async search(
        @Query('codFiscale') codFiscale?: string,
        @Query('q') query?: string
    ) {
        // Verifica che almeno un parametro sia fornito
        if (!codFiscale && !query) {
            throw new BadRequestException('Fornire almeno un parametro di ricerca: codFiscale o q');
        }

        // Se è fornito il codice fiscale, ricerca esatta
        if (codFiscale) {
            return this.service.cercaPsicologoPerCodFiscale(codFiscale);
        }

        // Altrimenti ricerca per nome/cognome
        return this.service.cercaPsicologoPerNomeOCognome(query!);
    }
}
