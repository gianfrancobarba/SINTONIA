import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { QuestionnairesService } from './questionnaires.service.js';
import { QuestionnaireResponseDto } from './dto/questionnaire-response.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('questionnaires')
export class QuestionnairesController {
    constructor(private readonly questionnairesService: QuestionnairesService) { }

    /**
     * Get single questionnaire by ID
     * Accessible by both admin and psychologist
     * 
     * @param id - UUID of the questionnaire
     * @returns QuestionnaireResponseDto
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getQuestionnaireById(
        @Param('id') id: string,
    ): Promise<QuestionnaireResponseDto> {
        return this.questionnairesService.getQuestionnaireById(id);
    }
}
