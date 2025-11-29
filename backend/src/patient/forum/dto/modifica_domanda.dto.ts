/**
 * DTO per la richiesta di modifica di una domanda nel forum
 * Tutti i campi sono opzionali
 */
export class ModificaDomandaDto {
    /**
     * Titolo della domanda (max 64 caratteri) - opzionale
     */
    titolo?: string;

    /**
     * Testo completo della domanda - opzionale
     */
    testo?: string;

    /**
     * Categoria tematica della domanda (max 128 caratteri) - opzionale
     */
    categoria?: string;

    /**
     * Valida che i campi rispettino i limiti e che almeno un campo sia presente
     */
    validate(): string[] {
        const errors: string[] = [];

        // Verifica che almeno un campo sia presente
        if (!this.titolo && !this.testo && !this.categoria) {
            errors.push('Almeno un campo deve essere specificato per la modifica');
            return errors; // Return early se nessun campo
        }

        // Valida lunghezza campi se presenti
        if (this.titolo !== undefined) {
            if (this.titolo.trim().length === 0) {
                errors.push('Il titolo non può essere vuoto');
            } else if (this.titolo.length > 64) {
                errors.push('Il titolo non può superare 64 caratteri');
            }
        }

        if (this.testo !== undefined && this.testo.trim().length === 0) {
            errors.push('Il testo non può essere vuoto');
        }

        if (this.categoria !== undefined) {
            if (this.categoria.trim().length === 0) {
                errors.push('La categoria non può essere vuota');
            } else if (this.categoria.length > 128) {
                errors.push('La categoria non può superare 128 caratteri');
            }
        }

        return errors;
    }
}

/**
 * DTO per la risposta dopo la modifica di una domanda
 */
export class DomandaModificataDto {
    /**
     * Indica se l'operazione è stata completata con successo
     */
    success: boolean;

    /**
     * Messaggio di conferma
     */
    message: string;
}
