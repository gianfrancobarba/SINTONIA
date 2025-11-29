import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente, psicologo } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class Modifica_paziente_amministratoreService {
    /**
     * Aggiorna i campi modificabili di un paziente
     */
    async aggiornaPaziente(
        idPaziente: string,
        updates: {
            email?: string;
            residenza?: string;
            idPsicologo?: string;
        }
    ) {
        // Verifica che il paziente esista
        const existingPatient = await db
            .select()
            .from(paziente)
            .where(eq(paziente.idPaziente, idPaziente))
            .limit(1);

        if (existingPatient.length === 0) {
            throw new NotFoundException(`Paziente con ID ${idPaziente} non trovato`);
        }

        // Aggiorna solo i campi forniti
        const updateData: any = {};
        if (updates.email !== undefined) updateData.email = updates.email;
        if (updates.residenza !== undefined) updateData.residenza = updates.residenza;
        if (updates.idPsicologo !== undefined) updateData.idPsicologo = updates.idPsicologo;

        await db
            .update(paziente)
            .set(updateData)
            .where(eq(paziente.idPaziente, idPaziente));

        return { success: true, message: 'Paziente aggiornato con successo' };
    }

    /**
     * Ottiene i dettagli completi di un singolo paziente
     */
    async getDettaglioPaziente(idPaziente: string) {
        const rows = await db
            .select({
                idPaziente: paziente.idPaziente,
                nome: paziente.nome,
                cognome: paziente.cognome,
                email: paziente.email,
                codFiscale: paziente.codFiscale,
                dataNascita: paziente.dataNascita,
                dataIngresso: paziente.dataIngresso,
                residenza: paziente.residenza,
                sesso: paziente.sesso,
                score: paziente.score,
                terms: paziente.terms,
                idPsicologo: paziente.idPsicologo,
                idPriorita: paziente.idPriorita,
                // Informazioni psicologo
                nomePsicologo: psicologo.nome,
                cognomePsicologo: psicologo.cognome,
            })
            .from(paziente)
            .leftJoin(psicologo, eq(paziente.idPsicologo, psicologo.codFiscale))
            .where(eq(paziente.idPaziente, idPaziente))
            .limit(1);

        if (rows.length === 0) {
            throw new NotFoundException(`Paziente con ID ${idPaziente} non trovato`);
        }

        const row = rows[0];
        return {
            idPaziente: row.idPaziente,
            nome: row.nome,
            cognome: row.cognome,
            email: row.email,
            codFiscale: row.codFiscale,
            dataNascita: row.dataNascita,
            dataIngresso: row.dataIngresso,
            residenza: row.residenza,
            sesso: row.sesso,
            score: row.score,
            terms: row.terms,
            idPsicologo: row.idPsicologo,
            idPriorita: row.idPriorita,
            nomePsicologo: row.nomePsicologo && row.cognomePsicologo
                ? `Dr. ${row.nomePsicologo} ${row.cognomePsicologo}`
                : null,
        };
    }
}
