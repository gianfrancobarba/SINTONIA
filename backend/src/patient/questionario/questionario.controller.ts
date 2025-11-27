import { Controller } from '@nestjs/common';
import { QuestionarioService } from '../questionario/questionario.service.js';

@Controller('paziente/questionario')
export class QuestionarioController {
    constructor(private readonly questionarioService: QuestionarioService) { }

    // GET /paziente/questionario/:idQuestionario - Ottiene un questionario specifico da compilare

    // POST /paziente/questionario/:idQuestionario/submit - Invia le risposte del questionario compilato

    // GET /paziente/questionario/tipologie - Ottiene le tipologie di questionari disponibili (opzionale)
}
