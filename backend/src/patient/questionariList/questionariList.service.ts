import { Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { questionario, tipologiaQuestionario, paziente } from '../../drizzle/schema.js';

@Injectable()
export class QuestionariListService {
    // Metodo per ottenere la lista di tutti i questionari del paziente
    // - Recupera questionari già compilati (con data, score, stato revisione)
    // - Recupera questionari disponibili ma non ancora compilati
    // - Combina le informazioni da questionario + tipologia_questionario
    // - Restituisce array ordinato per data o priorità

    // Possibile logica:
    // 1. Query questionari compilati dal paziente (JOIN tipologia_questionario)
    // 2. Query tipologie disponibili (basate su tempo_somministrazione e data_ingresso paziente)
    // 3. Filtrare tipologie già compilate
    // 4. Merge e mappare a ListaQuestionariDto
}
