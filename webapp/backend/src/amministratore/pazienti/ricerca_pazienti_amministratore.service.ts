import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente, psicologo } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class Ricerca_pazienti_amministratoreService {
    async cercaPazientePerId(idPaziente: string) {
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
                // Informazioni psicologo
                nomePsicologo: psicologo.nome,
                cognomePsicologo: psicologo.cognome,
            })
            .from(paziente)
            .leftJoin(psicologo, eq(paziente.idPsicologo, psicologo.codFiscale))
            .where(eq(paziente.idPaziente, idPaziente));

        // Verifica che il paziente esista
        if (rows.length === 0) {
            throw new NotFoundException(`Paziente con ID ${idPaziente} non trovato`);
        }

        const row = rows[0];

        // Formatta il risultato per il frontend
        return {
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
        };
    }
}
