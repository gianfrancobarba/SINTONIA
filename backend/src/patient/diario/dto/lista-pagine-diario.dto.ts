/**
 * DTO per la lista completa delle pagine del diario
 * Utilizzato dall'endpoint GET /paziente/diario/lista
 * Restituisce tutte le pagine del diario del paziente
 */
export class ListaPagineDiarioDto {
    pagine: {
        idPaginaDiario: string;    // ID univoco della pagina (UUID)
        titolo: string;            // Titolo della pagina
        testoAnteprima: string;    // Prime 100 caratteri del testo
        dataInserimento: Date;     // Data scrittura
        dataFormattata: string;    // Data formato dd/MM
    }[];
    totale: number;  // Numero totale di pagine trovate
}
