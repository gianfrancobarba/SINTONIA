import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard.js';
import { Visualizzazione_lista_questionariService } from './visualizzazione_lista_questionari.service.js';
import { StoricoQuestionariDto } from '../../home/dto/questionari.dto.js';
import type { Request } from 'express';

@Controller('paziente/questionari')
export class Visualizzazione_lista_questionariController {
    constructor(private readonly questionariService: Visualizzazione_lista_questionariService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getStoricoQuestionari(
        @Req() req: Request,
        @Query('page') page?: number,
        @Query('limit') limit?: number
    ): Promise<StoricoQuestionariDto> {
        const userId = (req as any).user?.id;
        const pageNum = page ? Number(page) : 1;
        const limitNum = limit ? Number(limit) : 10;
        return this.questionariService.getStoricoQuestionari(userId, pageNum, limitNum);
    }

    /**
     * Verifica se il paziente ha compilato tutti e 4 i questionari iniziali
     * GET /paziente/questionari/initial-check
     * Ritorna: { hasCompleted: boolean, pendingQuestionnaires: string[] }
     */
    @Get('initial-check')
    @UseGuards(JwtAuthGuard)
    async checkInitialQuestionnaires(@Req() req: Request): Promise<{
        hasCompleted: boolean;
        pendingQuestionnaires: string[];
    }> {
        const userId = (req as any).user?.id;
        const pendingQuestionnaires = await this.questionariService.getPendingInitialQuestionnaires(userId);
        return {
            hasCompleted: pendingQuestionnaires.length === 0,
            pendingQuestionnaires
        };
    }
}
