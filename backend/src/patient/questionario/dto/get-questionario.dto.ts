// DTO per la risposta GET di un singolo questionario da compilare

export class GetQuestionarioDto {
    // idQuestionario: string - UUID del questionario

    // nomeTipologia: string - Nome della tipologia (es. WHO-5, PHQ-9, etc.)

    // tempoSomministrazione: number - Tempo previsto in minuti

    // domande: array - Lista delle domande con le opzioni di risposta
    // Struttura: { id, testo, tipo, opzioni }

    // campi: object - Eventuali campi aggiuntivi richiesti dalla tipologia
}
