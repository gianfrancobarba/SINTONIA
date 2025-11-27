// DTO per la risposta GET della lista questionari (storico + disponibili)

export class ListaQuestionariDto {
    // questionariCompilati: array - Lista dei questionari già compilati
    // Struttura: {
    //   idQuestionario: string (UUID),
    //   nomeTipologia: string,
    //   dataCompilazione: Date,
    //   score: number,
    //   revisionato: boolean,
    //   invalidato: boolean
    // }

    // questionariDisponibili: array - Lista dei questionari ancora da compilare
    // Struttura: {
    //   nomeTipologia: string,
    //   tempoSomministrazione: number (minuti),
    //   descrizione?: string (opzionale)
    // }

    // Oppure array unificato con flag:
    // questionari: array
    // Struttura: {
    //   id?: string (presente solo se compilato),
    //   nomeTipologia: string,
    //   stato: 'compilato' | 'da_compilare',
    //   dataCompilazione?: Date,
    //   score?: number,
    //   ...
    // }
}
