import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { DeleteStatoAnimoService } from './delete-stato-animo.service.js';
import { DeleteStatoAnimoDto } from './dto/delete-stato-animo.dto.js';
import type { Request } from 'express';

/**
 * Controller per l'eliminazione di stati d'animo esistenti
 * Endpoint: DELETE /paziente/stato-animo/:id
 */
@Controller('paziente/stato-animo')
export class DeleteStatoAnimoController {
    constructor(
        private readonly deleteStatoAnimoService: DeleteStatoAnimoService
    ) { }

    /**
     * DELETE /paziente/stato-animo/:id
     * Elimina uno stato d'animo esistente del paziente autenticato
     * 
     * @param id UUID dello stato d'animo da eliminare
     * @param req Request object con dati utente autenticato (JWT)
     * @returns Conferma dell'eliminazione
     * 
     * @example
     * URL: DELETE /paziente/stato-animo/a1b2c3d4-e5f6-7890-abcd-ef1234567890
     * 
     * Response:
     * {
     *   "success": true,
     *   "message": "Stato d'animo eliminato con successo"
     * }
     * 
     * @throws NotFoundException (404) se lo stato d'animo non esiste
     * @throws ForbiddenException (403) se lo stato d'animo non appartiene al paziente
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteStatoAnimo(
        @Param('id') id: string,
        @Req() req: Request
    ): Promise<DeleteStatoAnimoDto> {
        // Estrai l'ID del paziente dal token JWT
        const patientId = (req as any).user?.id as string;

        return this.deleteStatoAnimoService.deleteStatoAnimo(patientId, id);
    }
}
