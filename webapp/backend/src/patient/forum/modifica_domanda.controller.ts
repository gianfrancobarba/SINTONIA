import { Controller, Patch, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { ModificaDomandaService } from './modifica_domanda.service.js';
import { ModificaDomandaDto, DomandaModificataDto } from './dto/modifica_domanda.dto.js';

@Controller('paziente/forum')
export class ModificaDomandaController {
    constructor(
        private readonly modificaDomandaService: ModificaDomandaService
    ) { }

    /**
     * Endpoint per modificare una domanda esistente nel forum
     * PATCH /paziente/forum/domanda/:id
     * 
     * @param id - UUID della domanda da modificare
     * @param req - Request object contenente i dati dell'utente autenticato
     * @param dto - Campi da modificare (titolo, testo, categoria)
     * @returns Conferma modifica
     */
    @Patch('domanda/:id')
    @UseGuards(JwtAuthGuard)
    async modificaDomanda(
        @Param('id') id: string,
        @Request() req,
        @Body() dto: ModificaDomandaDto
    ): Promise<DomandaModificataDto> {
        // Estrae l'ID del paziente dal token di autenticazione
        const idPaziente = (req as any).user?.id as string;

        return this.modificaDomandaService.modificaDomanda(id, idPaziente, dto);
    }
}
