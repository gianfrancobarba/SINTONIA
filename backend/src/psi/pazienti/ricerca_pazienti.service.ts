import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente, psicologo } from '../../drizzle/schema.js';
import { eq, and, or, ilike } from 'drizzle-orm';

@Injectable()
export class Ricerca_pazientiService {
    async cercaPazientePerNome(query: string, idPsicologo: string) {
        const searchQuery = `%${query}%`;

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
                nomePsicologo: psicologo.nome,
                cognomePsicologo: psicologo.cognome,
            })
            .from(paziente)
            .leftJoin(psicologo, eq(paziente.idPsicologo, psicologo.codFiscale))
            .where(and(
                eq(paziente.idPsicologo, idPsicologo),
                or(
                    ilike(paziente.nome, searchQuery),
                    ilike(paziente.cognome, searchQuery),
                    ilike(paziente.idPaziente, searchQuery)
                )
            ));

        if (rows.length === 0) {
            throw new NotFoundException(`Nessun paziente trovato con "${query}"`);
        }

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
}
