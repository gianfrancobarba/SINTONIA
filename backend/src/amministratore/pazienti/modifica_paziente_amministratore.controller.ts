import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { Modifica_paziente_amministratoreService } from './modifica_paziente_amministratore.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/patients')
export class Modifica_paziente_amministratoreController {
    constructor(private readonly service: Modifica_paziente_amministratoreService) { }

    /**
     * Ottiene i dettagli completi di un paziente
     * Endpoint: GET /admin/patients/:id
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async getDettaglio(@Param('id') id: string) {
        return this.service.getDettaglioPaziente(id);
    }

    /**
     * Aggiorna i campi modificabili di un paziente
     * Endpoint: PATCH /admin/patients/:id
     */
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async aggiorna(
        @Param('id') id: string,
        @Body() updates: {
            email?: string;
            residenza?: string;
            idPsicologo?: string;
        }
    ) {
        return this.service.aggiornaPaziente(id, updates);
    }
}
