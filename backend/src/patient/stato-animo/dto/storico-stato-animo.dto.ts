/**
 * DTO per lo storico degli stati d'animo
 * Utilizzato dall'endpoint GET /paziente/stato-animo/storico
 * Restituisce una lista di umori per visualizzazione grafico
 */
export class StoricoStatoAnimoDto {
    entries: {
        date: string;          // Data in formato ISO (YYYY-MM-DD)
        umore: string;         // Tipo di umore: "Triste", "Felice", "Neutro", etc.
        intensita?: number;    // Intensità da 1 a 10 (opzionale)
    }[];
}
