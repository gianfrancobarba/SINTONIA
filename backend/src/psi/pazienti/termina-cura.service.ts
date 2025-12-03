import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente } from '../../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class TerminaCuraService {
    /**
     * Termina la cura di un paziente impostando stato = false
     * @param idPaziente - UUID del paziente
     * @param codiceFiscalePsicologo - Codice fiscale dello psicologo che termina la cura
     */
    async terminaCura(idPaziente: string, codiceFiscalePsicologo: string) {
        // Verifica che il paziente esista
        const pazienteRows = await db
            .select({
                idPaziente: paziente.idPaziente,
                nome: paziente.nome,
                cognome: paziente.cognome,
                idPsicologo: paziente.idPsicologo,
                stato: paziente.stato,
            })
            .from(paziente)
            .where(eq(paziente.idPaziente, idPaziente))
            .limit(1);

        if (pazienteRows.length === 0) {
            throw new NotFoundException(`Paziente con ID ${idPaziente} non trovato`);
        }

        const pazienteData = pazienteRows[0];

        // Verifica che il paziente sia assegnato a questo psicologo
        if (pazienteData.idPsicologo !== codiceFiscalePsicologo) {
            throw new ForbiddenException(
                'Non sei autorizzato a terminare la cura di questo paziente. Il paziente non è assegnato a te.'
            );
        }

        // Verifica che il paziente sia attualmente attivo
        if (!pazienteData.stato) {
            throw new BadRequestException(
                `La cura del paziente ${pazienteData.nome} ${pazienteData.cognome} è già stata terminata`
            );
        }

        // Imposta il paziente come non attivo (soft delete)
        await db
            .update(paziente)
            .set({ stato: false })
            .where(eq(paziente.idPaziente, idPaziente));

        return {
            message: 'Cura terminata con successo',
            idPaziente: idPaziente,
            nomePaziente: `${pazienteData.nome} ${pazienteData.cognome}`,
        };
    }
}
