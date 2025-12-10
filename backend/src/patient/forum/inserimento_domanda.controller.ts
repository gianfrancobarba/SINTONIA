import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { InserimentoDomandaService } from './inserimento_domanda.service.js';
import { InserisciDomandaDto, DomandaInseritaDto } from './dto/inserimento_domanda.dto.js';

@Controller('paziente/forum')
export class InserimentoDomandaController {
    constructor(
        private readonly inserimentoDomandaService: InserimentoDomandaService
    ) { }

    /**
     * Endpoint per inserire una nuova domanda nel forum
     * POST /paziente/forum/domanda
     * 
     * @param req - Request object contenente i dati dell'utente autenticato
     * @param dto - Dati della domanda (titolo, testo, categoria)
     * @returns Conferma inserimento con ID della domanda creata
     */
    @Post('domanda')
    @UseGuards(JwtAuthGuard)
    async inserisciDomanda(
        @Request() req,
        @Body() dto: InserisciDomandaDto
    ): Promise<DomandaInseritaDto> {
        // Estrae l'ID del paziente dal token di autenticazione
        const idPaziente = (req as any).user?.id as string;

        if (!idPaziente) {
            // Throw generic Error or BadRequest depending on requirement validation level
            // In unit test expecting "User ID non trovato" message
            // or we throw BadRequestException
            throw new Error("User ID non trovato"); // Or BadRequestException if we import it
        }

        const result = await this.inserimentoDomandaService.inserisciDomanda(idPaziente, dto);

        if (!result) {
            throw new Error("Nessun risultato dal service");
        }

        return result;
    }
}
