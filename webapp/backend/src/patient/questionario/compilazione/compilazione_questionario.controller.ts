import { Controller } from '@nestjs/common';
import { Compilazione_questionarioService } from './compilazione_questionario.service.js';
import { Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard.js';
import type { Request } from 'express';

@Controller('paziente/questionario')
export class Compilazione_questionarioController {
    constructor(private readonly questionarioService: Compilazione_questionarioService) { }

    // GET /paziente/questionario/:idQuestionario - Ottiene un questionario specifico da compilare
    @Get(':idQuestionario')
    @UseGuards(JwtAuthGuard)
    async getQuestionario(@Param('idQuestionario') idQuestionario: string) {
        return this.questionarioService.getQuestionarioDto(idQuestionario);
    }

    /**
     * Invia le risposte del questionario compilato
     * Body: { nomeTipologia: string, risposte: Array<{ idDomanda: string, valore: number }> }
     * Ritorna: { idQuestionario: string, score: number }
     */
    @Post('submit')
    @UseGuards(JwtAuthGuard)
    async submitQuestionario(
        @Req() req: Request,
        @Body() body: { nomeTipologia: string; risposte: Array<{ idDomanda: string; valore: number }> },
    ): Promise<{ idQuestionario: string; score: number }> {
        const userId = (req as any).user?.id as string;
        return this.questionarioService.submitQuestionario(userId, body.nomeTipologia, body.risposte);
    }

    /**
     * Avvia la compilazione creando un record di questionario per la tipologia richiesta
     * Body: { nomeTipologia: string }
     * Ritorna: il DTO completo del questionario
     */
    @Post('start')
    @UseGuards(JwtAuthGuard)
    async startCompilazione(
        @Req() req: Request,
        @Body('nomeTipologia') nomeTipologia: string,
    ): Promise<any> {
        const userId = (req as any).user?.id as string;
        return this.questionarioService.startCompilazione(userId, nomeTipologia);
    }
}
