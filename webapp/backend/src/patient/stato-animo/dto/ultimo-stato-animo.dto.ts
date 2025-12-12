/**
 * DTO per l'ultimo stato d'animo del paziente
 * Utilizzato dall'endpoint GET /paziente/stato-animo/ultimo
 * Restituisce l'umore più recente inserito dal paziente
 */
export class UltimoStatoAnimoDto {
    umore: string;           // Tipo di umore: "Triste", "Felice", "Agitato", etc.
    intensita?: number;      // Intensità dell'umore da 1 a 10 (opzionale)
    note?: string;           // Note testuali del paziente (opzionale)
    dataInserimento: Date;   // Quando è stato inserito lo stato d'animo
}
