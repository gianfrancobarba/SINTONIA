import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class Rimozione_paziente_amministratoreService {
    /**
     * Rimuove un paziente dalla lista d'attesa impostando stato = false
     * @param idPaziente - UUID del paziente
     */
    async rimuoviPaziente(idPaziente: string) {
        // Verifica che il paziente esista
        const pazienteRows = await db
            .select({
                idPaziente: paziente.idPaziente,
                nome: paziente.nome,
                cognome: paziente.cognome,
                stato: paziente.stato,
            })
            .from(paziente)
            .where(eq(paziente.idPaziente, idPaziente))
            .limit(1);

        if (pazienteRows.length === 0) {
            throw new NotFoundException(
                `Paziente con ID ${idPaziente} non trovato`
            );
        }

        const pazienteData = pazienteRows[0];

        // Verifica che il paziente sia attualmente attivo
        if (!pazienteData.stato) {
            throw new BadRequestException(
                `Il paziente ${pazienteData.nome} ${pazienteData.cognome} è già stato rimosso dalla lista d'attesa`
            );
        }

        // Imposta il paziente come non attivo (soft delete)
        await db
            .update(paziente)
            .set({ stato: false })
            .where(eq(paziente.idPaziente, idPaziente));

        return {
            success: true,
            message: 'Paziente rimosso dalla lista d\'attesa con successo',
            idPaziente: idPaziente,
            nomePaziente: `${pazienteData.nome} ${pazienteData.cognome}`,
        };
    }
}
