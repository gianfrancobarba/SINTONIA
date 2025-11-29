import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente, psicologo } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class Visualizzazione_pazientiService {
    /**
     * Restituisce i pazienti assegnati a uno specifico psicologo
     * @param idPsicologo - Codice fiscale dello psicologo
     */
    async getPazientiByPsicologo(idPsicologo: string) {
        const rows = await db
            .select({
                idPaziente: paziente.idPaziente,
                nome: paziente.nome,
                cognome: paziente.cognome,
                email: paziente.email,
                dataNascita: paziente.dataNascita,
                dataIngresso: paziente.dataIngresso,
                score: paziente.score,
                idPsicologo: paziente.idPsicologo,
                // Informazioni psicologo (sempre lo stesso in questo caso)
                nomePsicologo: psicologo.nome,
                cognomePsicologo: psicologo.cognome,
            })
            .from(paziente)
            .leftJoin(psicologo, eq(paziente.idPsicologo, psicologo.codFiscale))
            .where(eq(paziente.idPsicologo, idPsicologo));

        // Formatta i risultati per il frontend
        return rows.map(row => ({
            idPaziente: row.idPaziente,
            nome: row.nome,
            cognome: row.cognome,
            email: row.email,
            dataNascita: row.dataNascita,
            dataIngresso: row.dataIngresso,
            score: row.score,
            idPsicologo: row.idPsicologo,
            nomePsicologo: row.nomePsicologo && row.cognomePsicologo
                ? `Dr. ${row.nomePsicologo} ${row.cognomePsicologo}`
                : null,
        }));
    }

    /**
     * Ottiene i dettagli completi di un singolo paziente (solo se assegnato allo psicologo)
     * @param idPaziente - UUID del paziente
     * @param idPsicologo - Codice fiscale dello psicologo
     */
    async getDettaglioPaziente(idPaziente: string, idPsicologo: string) {
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

        // Verifica che il paziente sia assegnato a questo psicologo
        if (row.idPsicologo !== idPsicologo) {
            throw new NotFoundException(`Paziente non assegnato a questo psicologo`);
        }

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
