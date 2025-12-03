import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { Eliminazione_psicologo_amministratoreService } from './eliminazione_psicologo_amministratore.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/psychologists')
export class Eliminazione_psicologo_amministratoreController {
    constructor(private readonly service: Eliminazione_psicologo_amministratoreService) { }

    /**
     * Soft delete di uno psicologo (imposta stato = false)
     * Endpoint: DELETE /admin/psychologists/:codFiscale
     */
    @Delete(':codFiscale')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async elimina(@Param('codFiscale') codFiscale: string) {
        return this.service.eliminaPsicologo(codFiscale);
    }
}
