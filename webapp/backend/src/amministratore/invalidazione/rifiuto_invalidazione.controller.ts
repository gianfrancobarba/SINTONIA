import { Controller, Post, Param, UseGuards, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { Rifiuto_invalidazioneService } from './rifiuto_invalidazione.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/invalidation-requests')
export class Rifiuto_invalidazioneController {
    constructor(private readonly service: Rifiuto_invalidazioneService) { }

    /**
     * Rifiuta una richiesta di invalidazione
     * Endpoint: POST /admin/invalidation-requests/:id/reject
     */
    @Post(':id/reject')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async rifiutaRichiesta(@Param('id') id: string, @Request() req) {
        const emailAmministratore = req.user.email;
        await this.service.rifiutaRichiestaInvalidazione(id, emailAmministratore);
        return { message: 'Richiesta di invalidazione rifiutata' };
    }
}
