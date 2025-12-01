import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Visualizzazione_questionari_amministratoreService } from './visualizzazione_questionari_amministratore.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/questionnaires')
export class Visualizzazione_questionari_amministratoreController {
    constructor(private readonly service: Visualizzazione_questionari_amministratoreService) { }

    /**
     * Ritorna TUTTI i questionari di tutti i pazienti (inclusi quelli invalidati)
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async listAll() {
        return this.service.getTuttiQuestionari();
    }

    /**
     * Ritorna TUTTI i questionari di uno specifico paziente (anche invalidati)
     */
    @Get('patient/:idPaziente')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async listByPaziente(@Param('idPaziente') idPaziente: string) {
        return this.service.getQuestionariByPaziente(idPaziente);
    }

    /**
     * Ritorna il dettaglio completo di un questionario singolo con domande e risposte
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async getQuestionarioById(@Param('id') id: string) {
        return this.service.getQuestionarioById(id);
    }
}
