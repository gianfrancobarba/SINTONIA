import { Controller, Patch, UseGuards, Req, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { UpdateStatoAnimoService } from './update-stato-animo.service.js';
import { UpdateStatoAnimoDto } from './dto/update-stato-animo.dto.js';
import type { Request } from 'express';

/**
 * Controller per l'aggiornamento di stati d'animo esistenti
 * Endpoint: PATCH /paziente/stato-animo/:id
 */
@Controller('paziente/stato-animo')
export class UpdateStatoAnimoController {
    constructor(private readonly updateStatoAnimoService: UpdateStatoAnimoService) { }

    /**
     * PATCH /paziente/stato-animo/:id
     * Aggiorna uno stato d'animo esistente del paziente autenticato
     * 
     * @param req Request object con dati utente autenticato (JWT)
     * @param id UUID dello stato d'animo da aggiornare
     * @param dto Dati aggiornati dello stato d'animo (umore, intensità, note)
     * @returns Dati completi dello stato d'animo aggiornato
     * 
     * @example
     * URL: PATCH /paziente/stato-animo/a1b2c3d4-e5f6-7890-abcd-ef1234567890
     * 
     * Body:
     * {
     *   "umore": "Neutro",
     *   "intensita": 5,
     *   "note": "Giornata nella media"
     * }
     * 
     * Response:
     * {
     *   "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
     *   "umore": "Neutro",
     *   "intensita": 5,
     *   "note": "Giornata nella media",
     *   "dataInserimento": "2025-12-02T08:30:00.000Z"
     * }
     */
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateStatoAnimo(
        @Req() req: Request,
        @Param('id') id: string,
        @Body() dto: UpdateStatoAnimoDto
    ): Promise<{ id: string; umore: string; intensita?: number; note?: string; dataInserimento: Date }> {
        // Estrai l'ID del paziente dal token JWT
        const patientId = (req as any).user?.id;
        return this.updateStatoAnimoService.updateStatoAnimo(patientId, id, dto);
    }
}
