import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { psicologo } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { ModificaPsicologoDto } from './dto/modifica-psicologo.dto.js';

@Injectable()
export class Modifica_psicologo_amministratoreService {
    /**
     * Modifica i dati di uno psicologo esistente
     */
    async modificaPsicologo(codFiscale: string, dto: ModificaPsicologoDto) {
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

        // Prepara i dati da aggiornare
        const updateData: any = {};
        if (dto.email !== undefined) updateData.email = dto.email;
        if (dto.aslAppartenenza !== undefined) updateData.aslAppartenenza = dto.aslAppartenenza;

        if (Object.keys(updateData).length === 0) {
            return {
                success: true,
                message: 'Nessun dato da aggiornare',
                data: esistente[0],
            };
        }

        // Esegue l'aggiornamento
        const psicologoAggiornato = await db
            .update(psicologo)
            .set(updateData)
            .where(eq(psicologo.codFiscale, codFiscale))
            .returning();

        return {
            success: true,
            message: 'Psicologo aggiornato con successo',
            data: psicologoAggiornato[0],
        };
    }
}
