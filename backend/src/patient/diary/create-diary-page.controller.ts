import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { CreateDiaryPageService } from './create-diary-page.service.js';
import { DiaryPageDto } from './dto/diary-page.dto.js';
import { CreateDiaryPageDto } from './dto/create-diary-page.dto.js';
import type { Request } from 'express';

@Controller('paziente/diario')
export class CreateDiaryPageController {
    constructor(private readonly createDiaryPageService: CreateDiaryPageService) { }

    /**
     * Endpoint to create a new diary page
     * POST /paziente/diario
     * 
     * @param req - Request object containing authenticated user data
     * @param dto - Data for the new diary page
     * @returns The created diary page
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    async createDiaryPage(
        @Req() req: Request,
        @Body() dto: CreateDiaryPageDto
    ): Promise<DiaryPageDto> {
        // Extract patient ID from authenticated user
        const patientId = (req as any).user?.id;
        return this.createDiaryPageService.createDiaryPage(patientId, dto);
    }
}
