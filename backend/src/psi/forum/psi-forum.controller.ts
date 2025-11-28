import { Controller, Get, Post, Put, Delete, UseGuards, Request, Query, Body, Param } from '@nestjs/common';
import { PsiForumService } from './psi-forum.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/forum')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('psychologist')
export class PsiForumController {
    constructor(private readonly forumService: PsiForumService) { }

    @Get('all')
    // Ritorna tutte le domande
    async getAllQuestions(@Query('categoria') categoria?: string) {
        return this.forumService.getAllQuestions(categoria);
    }

    @Get('my-answers')
    // Ritorna domande a cui lo psicologo ha risposto
    async getMyAnswers(@Request() req, @Query('categoria') categoria?: string) {
        return this.forumService.getMyAnswers(req.user.id, categoria);
    }

    @Get('unanswered')
    // Ritorna domande che non hanno alcuna risposta
    async getUnansweredQuestions(@Query('categoria') categoria?: string) {
        return this.forumService.getUnansweredQuestions(categoria);
    }

    @Post('questions/:id/answer')
    async createAnswer(@Request() req, @Param('id') questionId: string, @Body() body: { testo: string }) {
        return this.forumService.createAnswer(req.user.id, questionId, body.testo);
    }

    @Put('answers/:id')
    async updateAnswer(@Request() req, @Param('id') answerId: string, @Body() body: { testo: string }) {
        return this.forumService.updateAnswer(req.user.id, answerId, body.testo);
    }

    @Delete('answers/:id')
    async deleteAnswer(@Request() req, @Param('id') answerId: string) {
        return this.forumService.deleteAnswer(req.user.id, answerId);
    }
}
