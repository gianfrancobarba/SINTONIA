import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { AreaPersonaleService } from './area-personale.service.js';
import { AreaPersonaleDto } from './dto/area-personale.dto.js';
import { UpdateAreaPersonaleDto } from './dto/update-area-personale.dto.js';
import type { Request } from 'express';

@Controller('paziente/area-personale')
export class AreaPersonaleController {
    constructor(private readonly areaPersonaleService: AreaPersonaleService) { }

    /**
     * GET /paziente/area-personale
     * Restituisce tutti i dati aggregati dell'area personale del paziente
     * inclusi: profilo, badge, stato d'animo, diario, questionari
     */
    @Get()
    @UseGuards(JwtAuthGuard)
    async getAreaPersonale(@Req() req: Request): Promise<AreaPersonaleDto> {
        const userId = (req as any).user?.id;
        return this.areaPersonaleService.getAreaPersonale(userId);
    }

    /**
     * PATCH /paziente/area-personale/me
     * Aggiorna i dati dell'area personale del paziente (es. email)
     */
    @Patch('me')
    @UseGuards(JwtAuthGuard)
    async updateAreaPersonale(@Req() req: Request, @Body() updates: UpdateAreaPersonaleDto): Promise<void> {
        const userId = (req as any).user?.id;
        return this.areaPersonaleService.updateAreaPersonale(userId, updates);
    }
}
