import { Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente, psicologo } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class Visualizzazione_pazienti_amministratoreService {
    /**
     * Restituisce TUTTI i pazienti della piattaforma con informazioni sullo psicologo assegnato
     */
    async getTuttiPazienti() {
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
            .leftJoin(psicologo, eq(paziente.idPsicologo, psicologo.codFiscale));

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
}
