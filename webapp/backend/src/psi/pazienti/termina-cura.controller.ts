import { Controller, Delete, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { TerminaCuraService } from './termina-cura.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/patients')
export class TerminaCuraController {
    constructor(private readonly service: TerminaCuraService) { }

    /**
     * Termina la cura di un paziente (soft delete)
     * Endpoint: DELETE /psi/patients/:idPaziente/termina-cura?cf={codiceFiscalePsicologo}
     * @param idPaziente - UUID del paziente (path param)
     * @param cf - Codice fiscale dello psicologo (query param)
     */
    @Delete(':idPaziente/termina-cura')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async terminaCura(
        @Param('idPaziente') idPaziente: string,
        @Query('cf') cf: string
    ) {
        if (!cf) {
            throw new BadRequestException('Codice fiscale psicologo richiesto');
        }

        if (!idPaziente) {
            throw new BadRequestException('ID paziente richiesto');
        }

        return this.service.terminaCura(idPaziente, cf);
    }
}
