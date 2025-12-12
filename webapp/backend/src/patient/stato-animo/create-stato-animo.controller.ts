import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { CreateStatoAnimoService } from './create-stato-animo.service.js';
import { CreateStatoAnimoDto } from './dto/create-stato-animo.dto.js';
import type { Request } from 'express';

/**
 * Controller per la creazione di nuovi stati d'animo
 * Endpoint: POST /paziente/stato-animo
 */
@Controller('paziente/stato-animo')
export class CreateStatoAnimoController {
    constructor(private readonly createStatoAnimoService: CreateStatoAnimoService) { }

    /**
     * POST /paziente/stato-animo
     * Crea un nuovo stato d'animo per il paziente autenticato
     * 
     * @param req Request object con dati utente autenticato (JWT)
     * @param dto Dati dello stato d'animo (umore, intensità, note)
     * @returns ID del nuovo stato d'animo creato e data di inserimento
     * 
     * @example
     * Body:
     * {
     *   "umore": "Felice",
     *   "intensita": 8,
     *   "note": "Giornata molto positiva"
     * }
     * 
     * Response:
     * {
     *   "id": "123e4567-e89b-12d3-a456-426614174000",
     *   "dataInserimento": "2025-12-02T09:30:00.000Z"
     * }
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    async createStatoAnimo(
        @Req() req: Request,
        @Body() dto: CreateStatoAnimoDto
    ): Promise<{ id: string; dataInserimento: Date }> {
        // Estrai l'ID del paziente dal token JWT
        const patientId = (req as any).user?.id;
        return this.createStatoAnimoService.createStatoAnimo(patientId, dto);
    }
}
