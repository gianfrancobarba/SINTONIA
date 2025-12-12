import { Controller, Post, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AnnullamentoRevisioneService } from './annullamento_revisione.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/questionnaires')
export class AnnullamentoRevisioneController {
    constructor(private readonly service: AnnullamentoRevisioneService) { }

    /**
     * Annulla la revisione di un questionario
     * Endpoint: POST /admin/questionnaires/:id/cancel-revision
     */
    @Post(':id/cancel-revision')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async annullaRevisione(@Param('id') id: string) {
        await this.service.annullaRevisione(id);
        return { message: 'Revisione annullata con successo' };
    }
}
