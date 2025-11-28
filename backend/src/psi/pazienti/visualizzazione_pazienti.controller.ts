import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
}
