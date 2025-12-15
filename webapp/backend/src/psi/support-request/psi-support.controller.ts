import { Controller, Post, Body, UseGuards, Req, InternalServerErrorException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';
import { TicketService } from '../../ticket/ticket.service.js';
import { PsiSupportRequestDto } from './dto/psi-support-request.dto.js';
import type { Request } from 'express';
import { db } from '../../drizzle/db.js';
import { psicologo } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';

@Controller('psi/support-request')
export class PsiSupportController {
    constructor(private readonly ticketService: TicketService) { }

    /**
     * POST /psi/support-request
     * Crea un nuovo ticket di supporto tecnico per lo psicologo
     */
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async createSupportRequest(
        @Req() req: Request,
        @Body() dto: PsiSupportRequestDto,
    ): Promise<{ success: boolean; message: string }> {
        // Il codice fiscale dello psicologo è nel token JWT come 'id' o 'sub'
        let psychologistId = (req as any).user?.id;

        // Se l'ID sembra un'email, cerchiamo il codice fiscale nel DB
        if (psychologistId && psychologistId.includes('@')) {
            const result = await db
                .select({ codFiscale: psicologo.codFiscale })
                .from(psicologo)
                .where(eq(psicologo.email, psychologistId))
                .limit(1);

            if (result.length > 0) {
                psychologistId = result[0].codFiscale;
            } else {
                console.error('Psicologo non trovato per email:', psychologistId);
                throw new InternalServerErrorException('Impossibile identificare lo psicologo');
            }
        }

        return this.ticketService.createTicket({
            oggetto: dto.oggetto,
            descrizione: dto.descrizione,
            idPsicologo: psychologistId,
        });
    }
}
