import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { psicologo } from '../../drizzle/schema.js';
import { eq, or, ilike } from 'drizzle-orm';

@Injectable()
export class Ricerca_psicologi_amministratoreService {
    /**
     * Cerca psicologo per codice fiscale (ricerca esatta)
     */
    async cercaPsicologoPerCodFiscale(codFiscale: string) {
        const rows = await db
            .select({
                codFiscale: psicologo.codFiscale,
                nome: psicologo.nome,
                cognome: psicologo.cognome,
                aslAppartenenza: psicologo.aslAppartenenza,
                stato: psicologo.stato,
                immagineProfilo: psicologo.immagineProfilo,
            })
            .from(psicologo)
            .where(eq(psicologo.codFiscale, codFiscale));

        // Verifica che lo psicologo esista
        if (rows.length === 0) {
            throw new NotFoundException(`Psicologo con codice fiscale ${codFiscale} non trovato`);
        }

        // Ritorna singolo risultato
        return rows[0];
    }

    /**
     * Cerca psicologo per nome o cognome (ricerca case-insensitive parziale)
     */
    async cercaPsicologoPerNomeOCognome(query: string) {
        const searchQuery = `%${query}%`;

        const rows = await db
            .select({
                codFiscale: psicologo.codFiscale,
                nome: psicologo.nome,
                cognome: psicologo.cognome,
                aslAppartenenza: psicologo.aslAppartenenza,
                stato: psicologo.stato,
                immagineProfilo: psicologo.immagineProfilo,
            })
            .from(psicologo)
            .where(
                or(
                    ilike(psicologo.nome, searchQuery),
                    ilike(psicologo.cognome, searchQuery),
                    ilike(psicologo.codFiscale, searchQuery)
                )
            );

        if (rows.length === 0) {
            throw new NotFoundException(`Nessuno psicologo trovato con "${query}"`);
        }

        // Ritorna array di risultati
        return rows;
    }
}
