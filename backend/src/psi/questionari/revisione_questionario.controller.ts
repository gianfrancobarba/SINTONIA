import { Controller, Post, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { RevisioneQuestionarioService } from './revisione_questionario.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/questionnaires')
export class RevisioneQuestionarioController {
    constructor(private readonly service: RevisioneQuestionarioService) { }

    /**
     * Revisiona un questionario
     * Endpoint: POST /psi/questionnaires/:id/review
     * @param id - ID del questionario
     * @param cf - Codice fiscale dello psicologo (query param)
     */
    @Post(':id/review')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async revisionaQuestionario(
        @Param('id') id: string,
        @Query('cf') cf: string
    ) {
        await this.service.revisionaQuestionario(id, cf);
        return { message: 'Questionario revisionato con successo' };
    }
}
