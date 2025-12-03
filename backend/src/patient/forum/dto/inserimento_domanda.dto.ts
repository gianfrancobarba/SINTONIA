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

    /**
     * Valida che i campi rispettino i limiti del database
     */
    validate(): string[] {
        const errors: string[] = [];

        if (!this.titolo || this.titolo.trim().length === 0) {
            errors.push('Il titolo è obbligatorio');
        } else if (this.titolo.length > 64) {
            errors.push('Il titolo non può superare 64 caratteri');
        }

        if (!this.testo || this.testo.trim().length === 0) {
            errors.push('Il testo è obbligatorio');
        }

        if (!this.categoria || this.categoria.trim().length === 0) {
            errors.push('La categoria è obbligatoria');
        } else if (this.categoria.length > 128) {
            errors.push('La categoria non può superare 128 caratteri');
        }

        return errors;
    }
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

