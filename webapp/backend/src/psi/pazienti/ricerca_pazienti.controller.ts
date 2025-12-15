import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Ricerca_pazientiService } from './ricerca_pazienti.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/patients/search')
export class Ricerca_pazientiController {
    constructor(private readonly service: Ricerca_pazientiService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async searchByName(@Query('q') query: string, @Query('cf') cf: string) {
        if (!cf) {
            throw new Error('Codice fiscale psicologo richiesto');
        }
        if (!query) {
            throw new Error('Query di ricerca richiesta');
        }
        return this.service.cercaPazientePerNome(query, cf);
    }
}
