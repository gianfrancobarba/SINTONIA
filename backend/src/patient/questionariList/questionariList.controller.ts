import { Controller } from '@nestjs/common';
import { QuestionariListService } from './questionariList.service.js';

@Controller('paziente/questionariList')
export class QuestionariListController {
    constructor(private readonly questionariListService: QuestionariListService) { }

    // GET /paziente/questionariList - Ottiene la lista completa dei questionari (compilati e da compilare)
    // Response: ListaQuestionariDto
}
