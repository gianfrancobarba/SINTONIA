import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ForumService } from './forum.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { ForumQuestionDto } from '../../forum-comune/dto/forum.dto.js';

@Controller('patient/forum')
@UseGuards(JwtAuthGuard)
export class ForumController {
    constructor(private readonly forumService: ForumService) { }

    @Get('my-questions')
    // Ritorna le domande che il paziente ha pubblicato
    async getMyQuestions(@Request() req) {
    }

    @Get('public-questions')
    // Ritorna le domande pubbliche che hanno almeno una risposta
    async getPublicQuestions(@Request() req) {
        return this.forumService.getPublicQuestions(req.user.id);
    }
}
