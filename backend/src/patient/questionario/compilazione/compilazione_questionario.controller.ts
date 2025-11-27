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

    // POST /paziente/questionario/:idQuestionario/submit - Invia le risposte del questionario compilato

    // GET /paziente/questionario/tipologie - Ottiene le tipologie di questionari disponibili (opzionale)

    /**
     * Avvia la compilazione creando un record di questionario per la tipologia richiesta
     * Body: { nomeTipologia: string }
     * Ritorna: { idQuestionario: string }
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
