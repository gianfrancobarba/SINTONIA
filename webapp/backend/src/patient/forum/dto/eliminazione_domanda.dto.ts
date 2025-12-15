/**
 * DTO per la risposta dopo l'eliminazione di una domanda
 */
export class DomandaEliminataDto {
    /**
     * Indica se l'operazione è stata completata con successo
     */
    success: boolean;

    /**
     * Messaggio di conferma
     */
    message: string;
}
