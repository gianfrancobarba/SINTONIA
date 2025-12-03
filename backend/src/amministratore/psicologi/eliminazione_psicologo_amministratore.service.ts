import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { psicologo, paziente } from '../../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class Eliminazione_psicologo_amministratoreService {
    /**
     * Soft delete di uno psicologo (imposta stato = false)
     * Impedisce l'eliminazione se ha pazienti attivi assegnati
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

        // Verifica se ha pazienti attivi assegnati
        const pazientiAssegnati = await db
            .select()
            .from(paziente)
            .where(
                and(
                    eq(paziente.idPsicologo, codFiscale),
                    eq(paziente.stato, true) // solo pazienti attivi
                )
            )
            .limit(1);

        if (pazientiAssegnati.length > 0) {
            throw new BadRequestException(
                'Lo psicologo ha pazienti in carico e non può essere eliminato'
            );
        }

        // Soft delete: imposta stato = false
        await db
            .update(psicologo)
            .set({ stato: false })
            .where(eq(psicologo.codFiscale, codFiscale));

        return {
            success: true,
            message: 'Psicologo eliminato con successo',
            data: esistente[0],
        };
    }
}
