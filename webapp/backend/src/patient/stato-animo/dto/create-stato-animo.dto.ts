/**
 * DTO per la creazione di un nuovo stato d'animo
 * Utilizzato dall'endpoint POST /paziente/stato-animo
 */
export class CreateStatoAnimoDto {
    umore: string;        // Tipo di umore (deve essere uno dei valori dell'enum)
    intensita: number;   // Intensità dell'umore da 1 a 10 (obbligatorio)
    note?: string;        // Note testuali del paziente (opzionale)
    dataInserimento?: string; // Data di inserimento (opzionale, formato ISO string)


}

