import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { Modifica_psicologo_amministratoreService } from './modifica_psicologo_amministratore.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';
import { ModificaPsicologoDto } from './dto/modifica-psicologo.dto.js';

@Controller('admin/psychologists')
export class Modifica_psicologo_amministratoreController {
    constructor(
        private readonly service: Modifica_psicologo_amministratoreService
    ) { }

    /**
     * Modifica uno psicologo esistente
     * Endpoint: PATCH /admin/psychologists/:codFiscale
     */
    @Patch(':codFiscale')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async modifica(
        @Param('codFiscale') codFiscale: string,
        @Body() dto: ModificaPsicologoDto
    ) {
        return this.service.modificaPsicologo(codFiscale, dto);
    }
}
