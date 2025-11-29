import { Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { psicologo } from '../../drizzle/schema.js';

@Injectable()
export class Visualizzazione_psicologi_amministratoreService {
    /**
     * Restituisce TUTTI gli psicologi della piattaforma
     */
    async getTuttiPsicologi() {
        const rows = await db
            .select({
                codFiscale: psicologo.codFiscale,
                nome: psicologo.nome,
                cognome: psicologo.cognome,
            })
            .from(psicologo);

        return rows;
    }
}
