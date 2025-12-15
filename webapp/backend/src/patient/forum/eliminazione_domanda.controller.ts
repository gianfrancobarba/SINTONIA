import { Controller, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { EliminazioneDomandaService } from './eliminazione_domanda.service.js';
import { DomandaEliminataDto } from './dto/eliminazione_domanda.dto.js';

@Controller('paziente/forum')
export class EliminazioneDomandaController {
    constructor(
        private readonly eliminazioneDomandaService: EliminazioneDomandaService
    ) { }

    /**
     * Endpoint per eliminare una domanda dal forum
     * DELETE /paziente/forum/domanda/:id
     * 
     * @param id - UUID della domanda da eliminare
     * @param req - Request object contenente i dati dell'utente autenticato
     * @returns Conferma eliminazione
     */
    @Delete('domanda/:id')
    @UseGuards(JwtAuthGuard)
    async eliminaDomanda(
        @Param('id') id: string,
        @Request() req
    ): Promise<DomandaEliminataDto> {
        // Estrae l'ID del paziente dal token di autenticazione
        const idPaziente = (req as any).user?.id as string;

        return this.eliminazioneDomandaService.eliminaDomanda(id, idPaziente);
    }
}
