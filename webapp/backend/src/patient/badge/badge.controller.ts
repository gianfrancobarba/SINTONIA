import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
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

    /**
     * POST /paziente/badge/check
     * Controlla i criteri e assegna i badge guadagnati
     * @returns Lista dei nuovi badge assegnati
     */
    @Post('check')
    @UseGuards(JwtAuthGuard)
    async checkAndAwardBadges(@Req() req: Request): Promise<{ newBadges: string[]; message: string }> {
        const userId = (req as any).user?.id;
        const newBadges = await this.badgeService.checkAndAwardBadges(userId);

        return {
            newBadges,
            message: newBadges.length > 0
                ? `Complimenti! Hai ottenuto ${newBadges.length} nuovi badge: ${newBadges.join(', ')}`
                : 'Nessun nuovo badge ottenuto. Continua così!'
        };
    }

    /**
     * GET /paziente/badge/check
     * Versione GET per controllo badge (utile per chiamate automatiche)
     */
    @Get('check')
    @UseGuards(JwtAuthGuard)
    async checkBadgesGet(@Req() req: Request): Promise<{ newBadges: string[]; message: string }> {
        return this.checkAndAwardBadges(req);
    }
}
