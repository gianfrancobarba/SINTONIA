import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { BadgeService } from './badge.service.js';
import { BadgeUtenteDto } from './dto/badge-utente.dto.js';
import type { Request } from 'express';

@Controller('paziente/badge')
export class BadgeController {
    constructor(private readonly badgeService: BadgeService) { }

    /**
     * GET /paziente/badge/lista
     * Restituisce tutti i badge acquisiti dal paziente
     */
    @Get('lista')
    @UseGuards(JwtAuthGuard)
    async getBadgeUtente(@Req() req: Request): Promise<BadgeUtenteDto> {
        const userId = (req as any).user?.id;
        return this.badgeService.getBadgeUtente(userId);
    }
}
