import { Controller, Post, Param, UseGuards, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { Accettazione_invalidazioneService } from './accettazione_invalidazione.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/invalidation-requests')
export class Accettazione_invalidazioneController {
    constructor(private readonly service: Accettazione_invalidazioneService) { }

    /**
     * Accetta una richiesta di invalidazione
     * Endpoint: POST /admin/invalidation-requests/:id/accept
     */
    @Post(':id/accept')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async accettaRichiesta(@Param('id') id: string, @Request() req) {
        const emailAmministratore = req.user.email;
        await this.service.accettaRichiestaInvalidazione(id, emailAmministratore);
        return { message: 'Richiesta di invalidazione accettata con successo' };
    }
}
