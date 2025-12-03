/**
 * DTO per la risposta dopo l'eliminazione di una pagina del diario
 */
export class DeleteDiaryPageDto {
    /**
     * Indica se l'operazione è stata completata con successo
     */
    success: boolean;

    /**
     * Messaggio di conferma
     */
    message: string;
}
