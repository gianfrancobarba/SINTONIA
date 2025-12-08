import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente, priorita } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';

// Type for valid priority values
type ValidPriority = 'Urgente' | 'Breve' | 'Differibile' | 'Programmabile';

@Injectable()
export class Modifica_priorita_paziente_amministratoreService {
    /**
     * Modifica la priorità di un paziente
     */
    async modificaPrioritaPaziente(idPaziente: string, nuovaPriorita: string) {
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

        // Verifica che la priorità esista nella tabella priorita
        const prioritaEsistente = await db
            .select()
            .from(priorita)
            .where(eq(priorita.nome, prioritaValidata))
            .limit(1);

        if (prioritaEsistente.length === 0) {
            throw new NotFoundException(`Priorità "${nuovaPriorita}" non trovata`);
        }

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
