import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente, priorita } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';

// Type for valid priority values
type ValidPriority = 'Urgente' | 'Breve' | 'Differibile' | 'Programmabile';

@Injectable()
export class Modifica_priorita_paziente_amministratoreService {
    /**
     * Metodo di validazione della richiesta di modifica priorità.
     * Verifica la validità della priorità e l'esistenza del paziente.
     */
    async validazione(idPaziente: string, nuovaPriorita: string): Promise<ValidPriority> {
        // Validate priority value
        const validPriorities: ValidPriority[] = ['Urgente', 'Breve', 'Differibile', 'Programmabile'];
        if (!validPriorities.includes(nuovaPriorita as ValidPriority)) {
            throw new BadRequestException(
                `Priorità non valida. Valori accettati: ${validPriorities.join(', ')}`
            );
        }

        // Cast to ValidPriority after validation
        const prioritaValidata = nuovaPriorita as ValidPriority;

        // Verifica che il paziente esista
        const pazienteEsistente = await db
            .select()
            .from(paziente)
            .where(eq(paziente.idPaziente, idPaziente))
            .limit(1);

        if (pazienteEsistente.length === 0) {
            throw new NotFoundException(`Paziente con ID ${idPaziente} non trovato`);
        }

        return prioritaValidata;
    }

    /**
     * Modifica la priorità di un paziente
     */
    async modificaPrioritaPaziente(idPaziente: string, nuovaPriorita: string) {
        // Esegui validazione
        const prioritaValidata = await this.validazione(idPaziente, nuovaPriorita);

        // Aggiorna la priorità del paziente
        await db
            .update(paziente)
            .set({ idPriorita: prioritaValidata })
            .where(eq(paziente.idPaziente, idPaziente));

        return {
            success: true,
            message: 'Priorità paziente aggiornata con successo',
            data: {
                idPaziente,
                nuovaPriorita: prioritaValidata
            }
        };
    }
}
