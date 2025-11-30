/**
 * DTO per l'ultima pagina del diario del paziente
 * Utilizzato dall'endpoint GET /paziente/diario/ultima-pagina
 * Restituisce un'anteprima dell'ultima entry scritta nel diario
 */
export class UltimaPaginaDiarioDto {
    idPaginaDiario: string;    // ID univoco della pagina (UUID)
    titolo: string;            // Titolo della pagina diario
    testoAnteprima: string;    // Prime 100 caratteri del testo completo
    dataInserimento: Date;     // Quando è stata scritta la pagina
    dataFormattata: string;    // Data in formato dd/MM (es: "11/10")
}
