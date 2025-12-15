/**
 * DTO per la risposta dopo l'eliminazione di uno stato d'animo
 */
export class DeleteStatoAnimoDto {
    /**
     * Indica se l'operazione è stata completata con successo
     */
    success: boolean;

    /**
     * Messaggio di conferma
     */
    message: string;
}
