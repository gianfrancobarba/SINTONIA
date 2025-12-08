/**
 * DTO per l'aggiornamento di uno stato d'animo esistente
 * Utilizzato dall'endpoint PATCH /paziente/stato-animo/:id
 */
export class UpdateStatoAnimoDto {
    umore: string;        // Tipo di umore (deve essere uno dei valori dell'enum)
    intensita?: number;   // Intensità dell'umore da 1 a 10 (opzionale)
    note?: string;        // Note testuali del paziente (opzionale)

    /**
     * Valida il DTO
     * @returns Array di messaggi di errore (vuoto se valido)
     */
    validate(): string[] {
        const errors: string[] = [];

        // Valori validi per l'enum umore
        const validMoods = [
            'Felice',
            'Sereno',
            'Energico',
            'Neutro',
            'Stanco',
            'Triste',
            'Ansioso',
            'Arrabbiato',
            'Spaventato',
            'Confuso',
        ];

        // Valida umore (obbligatorio)
        if (!this.umore || typeof this.umore !== 'string') {
            errors.push('L\'umore è obbligatorio');
        } else if (!validMoods.includes(this.umore)) {
            errors.push(
                `L'umore deve essere uno dei seguenti valori: ${validMoods.join(', ')}`
            );
        }

        // Valida intensità (opzionale, ma se presente deve essere 1-10)
        if (this.intensita !== undefined && this.intensita !== null) {
            if (typeof this.intensita !== 'number') {
                errors.push('L\'intensità deve essere un numero');
            } else if (!Number.isInteger(this.intensita)) {
                errors.push('L\'intensità deve essere un numero intero');
            } else if (this.intensita < 1 || this.intensita > 10) {
                errors.push('L\'intensità deve essere compresa tra 1 e 10');
            }
        }

        // Valida note (opzionale, ma se presente deve essere stringa non troppo lunga)
        if (this.note !== undefined && this.note !== null) {
            if (typeof this.note !== 'string') {
                errors.push('Le note devono essere una stringa di testo');
            } else if (this.note.length > 500) {
                errors.push('Le note non possono superare i 500 caratteri');
            }
        }

        return errors;
    }
}
