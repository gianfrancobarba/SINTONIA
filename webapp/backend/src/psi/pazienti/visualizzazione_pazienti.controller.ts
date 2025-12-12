import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { Visualizzazione_pazientiService } from './visualizzazione_pazienti.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/patients')
export class Visualizzazione_pazientiController {
    constructor(private readonly service: Visualizzazione_pazientiService) { }

    /**
     * Ritorna i pazienti assegnati a uno specifico psicologo
     * Endpoint: GET /psi/patients?cf={codiceFiscalePsicologo}
     * @param cf - Codice fiscale dello psicologo (query param)
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async listByPsicologo(@Query('cf') cf: string) {
        if (!cf) {
            throw new Error('Codice fiscale psicologo richiesto');
        }
        return this.service.getPazientiByPsicologo(cf);
    }

    /**
     * Ottiene i dettagli completi di un paziente (solo se assegnato allo psicologo)
     * Endpoint: GET /psi/patients/:id?cf={codiceFiscalePsicologo}
     * @param id - UUID del paziente
     * @param cf - Codice fiscale dello psicologo (query param)
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async getDettaglio(@Param('id') id: string, @Query('cf') cf: string) {
        if (!cf) {
            throw new Error('Codice fiscale psicologo richiesto');
        }
        return this.service.getDettaglioPaziente(id, cf);
    }
}
