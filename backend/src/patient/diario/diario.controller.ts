import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { DiarioService } from './diario.service.js';
import { UltimaPaginaDiarioDto } from './dto/ultima-pagina-diario.dto.js';
import { ListaPagineDiarioDto } from './dto/lista-pagine-diario.dto.js';
import type { Request } from 'express';

@Controller('paziente/diario')
export class DiarioController {
    constructor(private readonly diarioService: DiarioService) { }

    /**
     * GET /paziente/diario/ultima-pagina
     * Restituisce l'ultima pagina del diario inserita dal paziente
     */
    @Get('ultima-pagina')
    @UseGuards(JwtAuthGuard)
    async getUltimaPagina(@Req() req: Request): Promise<UltimaPaginaDiarioDto | null> {
        const userId = (req as any).user?.id;
        return this.diarioService.getUltimaPaginaDiario(userId);
    }

    /**
     * GET /paziente/diario/lista?limit=50
     * Restituisce la lista di tutte le pagine del diario
     */
    @Get('lista')
    @UseGuards(JwtAuthGuard)
    async getListaPagine(
        @Req() req: Request,
        @Query('limit') limit?: string,
    ): Promise<ListaPagineDiarioDto> {
        const userId = (req as any).user?.id;
        const numLimit = limit ? parseInt(limit, 10) : 50;
        return this.diarioService.getListaPagineDiario(userId, numLimit);
    }
}
