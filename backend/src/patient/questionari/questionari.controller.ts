import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { QuestionariService } from './questionari.service.js';
import { StoricoQuestionariDto } from '../dto/questionari.dto.js';
import type { Request } from 'express';

@Controller('paziente/questionari')
export class QuestionariController {
    constructor(private readonly questionariService: QuestionariService) { }

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
}
