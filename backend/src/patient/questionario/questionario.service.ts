import { Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { questionario, tipologiaQuestionario } from '../../drizzle/schema.js';

@Injectable()
export class QuestionarioService {
    // Metodo per ottenere un questionario specifico con le sue domande dalla tipologia_questionario

    // Metodo per validare le risposte del questionario

    // Metodo per calcolare il punteggio del questionario in base alle risposte

    // Metodo per salvare il questionario compilato (risposte, score, data_compilazione)

    // Metodo per verificare i criteri di cambiamento (se applicabile)
}
