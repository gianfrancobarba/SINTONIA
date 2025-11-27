import { Controller } from '@nestjs/common';
import { Compilazione_questionarioService } from './compilazione_questionario.service.js';

@Controller('paziente/questionario')
export class Compilazione_questionarioController {
    constructor(private readonly questionarioService: Compilazione_questionarioService) { }

    // GET /paziente/questionario/:idQuestionario - Ottiene un questionario specifico da compilare

    // POST /paziente/questionario/:idQuestionario/submit - Invia le risposte del questionario compilato

    // GET /paziente/questionario/tipologie - Ottiene le tipologie di questionari disponibili (opzionale)
}
