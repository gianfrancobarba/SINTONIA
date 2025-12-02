import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { psicologo } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class Eliminazione_psicologo_amministratoreService {
    /**
     * Elimina definitivamente uno psicologo dal database
     */
    async eliminaPsicologo(codFiscale: string) {
        // Verifica che lo psicologo esista
        const esistente = await db
            .select()
            .from(psicologo)
            .where(eq(psicologo.codFiscale, codFiscale))
            .limit(1);

        if (esistente.length === 0) {
            throw new NotFoundException(
                `Psicologo con codice fiscale ${codFiscale} non trovato`
            );
        }

        // Elimina lo psicologo
        await db
            .delete(psicologo)
            .where(eq(psicologo.codFiscale, codFiscale));

        return {
            success: true,
            message: 'Psicologo eliminato con successo',
            data: esistente[0],
        };
    }
}
