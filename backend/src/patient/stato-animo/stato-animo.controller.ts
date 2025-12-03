import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { StatoAnimoService } from './stato-animo.service.js';
import { UltimoStatoAnimoDto } from './dto/ultimo-stato-animo.dto.js';
import { StoricoStatoAnimoDto } from './dto/storico-stato-animo.dto.js';
import type { Request } from 'express';

/**
 * Controller per la gestione degli stati d'animo del paziente
 * Endpoint base: /paziente/stato-animo
 * 
 * Fornisce:
 * - Recupero ultimo stato d'animo inserito
 * - Storico stati d'animo per visualizzazione grafico
 */
@Controller('paziente/stato-animo')
export class StatoAnimoController {
    constructor(private readonly statoAnimoService: StatoAnimoService) { }

    /**
     * GET /paziente/stato-animo/ultimo
     * Recupera l'ultimo stato d'animo inserito dal paziente
     * 
     * @returns UltimoStatoAnimoDto con umore, intensità, note e data
     * @returns null se il paziente non ha ancora inserito stati d'animo
     */
    @Get('ultimo')
    @UseGuards(JwtAuthGuard)
    async getUltimoStatoAnimo(@Req() req: Request): Promise<UltimoStatoAnimoDto | null> {
        const userId = (req as any).user?.id;
        return this.statoAnimoService.getUltimoStatoAnimo(userId);
    }

    /**
     * GET /paziente/stato-animo/oggi
     * Recupera lo stato d'animo inserito oggi
     */
    @Get('oggi')
    @UseGuards(JwtAuthGuard)
    async getStatoAnimoOggi(@Req() req: Request): Promise<any | null> {
        const userId = (req as any).user?.id;
        return this.statoAnimoService.getStatoAnimoOggi(userId);
    }

    /**
     * GET /paziente/stato-animo/storico?giorni=30
     * Recupera lo storico degli stati d'animo per il grafico
     * 
     * @param giorni Numero di giorni da recuperare (default: 30)
     * @returns StoricoStatoAnimoDto con array di umori ordinati cronologicamente
     */
    @Get('storico')
    @UseGuards(JwtAuthGuard)
    async getStoricoStatoAnimo(
        @Req() req: Request,
        @Query('giorni') giorni?: string,
    ): Promise<StoricoStatoAnimoDto> {
        const userId = (req as any).user?.id;
        const numGiorni = giorni ? parseInt(giorni, 10) : 30;
        return this.statoAnimoService.getStoricoStatoAnimo(userId, numGiorni);
    }
}
