import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { DiaryService } from './diary.service.js';
import { DiaryPageDto } from './dto/diary-page.dto.js';
import type { Request } from 'express';

@Controller('paziente/diario')
export class DiaryController {
    constructor(private readonly diaryService: DiaryService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getDiaryPages(@Req() req: Request): Promise<DiaryPageDto[]> {
        // Extract patient ID from authenticated user
        const patientId = (req as any).user?.id;
        return this.diaryService.getDiaryPages(patientId);
    }
}
