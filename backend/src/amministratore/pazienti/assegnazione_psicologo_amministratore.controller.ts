import { Controller, Put, Param, Body, UseGuards } from '@nestjs/common';
import { AssegnazionePsicologoAmministratoreService } from './assegnazione_psicologo_amministratore.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/patients')
export class AssegnazionePsicologoAmministratoreController {
    constructor(private readonly service: AssegnazionePsicologoAmministratoreService) { }

    /**
     * Assegna o rimuove uno psicologo
     * Endpoint: PUT /admin/patients/:id/psychologist
     */
    @Put(':id/psychologist')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async assegnaPsicologo(
        @Param('id') id: string,
        @Body() body: { idPsicologo: string }
    ) {
        return this.service.assegnaPsicologo(id, body.idPsicologo);
    }
}
