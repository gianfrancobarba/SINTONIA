import { Controller, Patch, UseGuards, Req, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { UpdateDiaryPageService } from './update-diary-page.service.js';
import { DiaryPageDto } from './dto/diary-page.dto.js';
import { UpdateDiaryPageDto } from './dto/update-diary-page.dto.js';
import type { Request } from 'express';

@Controller('paziente/diario')
export class UpdateDiaryPageController {
    constructor(private readonly updateDiaryPageService: UpdateDiaryPageService) { }

    /**
     * Endpoint to update an existing diary page
     * PATCH /paziente/diario/:id
     * 
     * @param req - Request object containing authenticated user data
     * @param id - UUID of the diary page to update
     * @param dto - Updated data for the diary page
     * @returns The updated diary page
     */
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateDiaryPage(
        @Req() req: Request,
        @Param('id') id: string,
        @Body() dto: UpdateDiaryPageDto
    ): Promise<DiaryPageDto> {
        // Extract patient ID from authenticated user
        const patientId = (req as any).user?.id;
        return this.updateDiaryPageService.updateDiaryPage(patientId, id, dto);
    }
}
