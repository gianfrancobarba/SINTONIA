/**
 * DTO per la richiesta di inserimento di una nuova domanda nel forum
 */
export class InserisciDomandaDto {
    /**
     * Titolo della domanda (max 64 caratteri)
     */
    titolo: string;

    /**
     * Testo completo della domanda
     */
    testo: string;

    /**
     * Categoria tematica della domanda (max 128 caratteri)
     */
    categoria: string;
}

/**
 * DTO per la risposta dopo l'inserimento di una domanda
 */
export class DomandaInseritaDto {
    /**
     * Indica se l'operazione è stata completata con successo
     */
    success: boolean;

    /**
     * UUID della domanda creata
     */
    idDomanda: string;

    /**
     * Messaggio di conferma
     */
    message: string;
}

