import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { DeleteDiaryPageService } from './delete-diary-page.service.js';
import { DeleteDiaryPageDto } from './dto/delete-diary-page.dto.js';
import type { Request } from 'express';

@Controller('paziente/diario')
export class DeleteDiaryPageController {
    constructor(
        private readonly deleteDiaryPageService: DeleteDiaryPageService
    ) { }

    /**
     * Endpoint to delete a diary page
     * DELETE /paziente/diario/:id
     * 
     * @param id - UUID of the diary page to delete
     * @param req - Request object containing authenticated user data
     * @returns Confirmation of deletion
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteDiaryPage(
        @Param('id') id: string,
        @Req() req: Request
    ): Promise<DeleteDiaryPageDto> {
        // Extract patient ID from authentication token
        const patientId = (req as any).user?.id as string;

        return this.deleteDiaryPageService.deleteDiaryPage(patientId, id);
    }
}
