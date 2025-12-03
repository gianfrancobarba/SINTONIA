// DTO per la risposta POST dopo l'invio del questionario

export class QuestionarioResultDto {
    // success: boolean - Indica se la compilazione è stata salvata con successo

    // idQuestionario: string - UUID del questionario salvato

    // score: number - Punteggio calcolato (opzionale se non calcolato dal backend)

    // cambiamento: boolean - Indica se c'è stato un cambiamento significativo rispetto ai precedenti

    // message: string - Messaggio di conferma o eventuali avvisi
}
