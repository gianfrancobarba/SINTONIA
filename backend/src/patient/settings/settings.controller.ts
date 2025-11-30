import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { SettingsService } from './settings.service.js';
import { PersonalInfoDto } from './dto/personal-info.dto.js';
import { SupportRequestDto } from './dto/support-request.dto.js';
import type { Request } from 'express';

@Controller('paziente/settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    /**
     * GET /paziente/settings/personal-info
     * Restituisce le informazioni personali del paziente autenticato
     * Esclusi dati clinici
     */
    @Get('personal-info')
    @UseGuards(JwtAuthGuard)
    async getPersonalInfo(@Req() req: Request): Promise<PersonalInfoDto> {
        const userId = (req as any).user?.id;
        return this.settingsService.getPersonalInfo(userId);
    }

    /**
     * POST /paziente/settings/support-request
     * Crea un nuovo ticket di supporto tecnico
     */
    @Post('support-request')
    @UseGuards(JwtAuthGuard)
    async createSupportRequest(
        @Req() req: Request,
        @Body() supportRequestDto: SupportRequestDto,
    ): Promise<{ success: boolean; message: string }> {
        const userId = (req as any).user?.id;
        return this.settingsService.createSupportRequest(userId, supportRequestDto);
    }
}
