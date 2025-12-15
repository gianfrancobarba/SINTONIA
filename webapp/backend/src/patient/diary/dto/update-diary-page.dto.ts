export class UpdateDiaryPageDto {
    title: string;
    content: string;

    /**
     * Validates the DTO
     * @returns Array of validation error messages (empty if valid)
     */
    validate(): string[] {
        const errors: string[] = [];

        // Validate title
        if (!this.title || typeof this.title !== 'string') {
            errors.push('Il titolo è obbligatorio');
        } else if (this.title.trim().length === 0) {
            errors.push('Il titolo non può essere vuoto');
        } else if (this.title.length > 64) {
            errors.push('Il titolo non può superare i 64 caratteri');
        }

        // Validate content
        if (!this.content || typeof this.content !== 'string') {
            errors.push('Il contenuto è obbligatorio');
        } else if (this.content.trim().length === 0) {
            errors.push('Il contenuto non può essere vuoto');
        } else if (this.content.length > 2000) {
            errors.push('Il contenuto non può superare i 2000 caratteri');
        }

        return errors;
    }
}
