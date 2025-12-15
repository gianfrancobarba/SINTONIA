import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente, psicologo } from '../../drizzle/schema.js';
import { sql, eq } from 'drizzle-orm';

import { AssegnazioneService } from '../../psi/assegnazione/assegnazione.service.js';

@Injectable()
export class AssegnazionePsicologoAmministratoreService {

    constructor(
        private readonly assegnazioneService: AssegnazioneService
    ) { }

    /**
     * Metodo di validazione delle entità
     */
    async validazione(idPaziente: string, idPsicologo: string) {
        if (!idPaziente) {
            throw new BadRequestException('L\'ID del paziente è obbligatorio.');
        }
        if (!idPsicologo) {
            throw new BadRequestException('L\'ID dello psicologo è obbligatorio.');
        }

        // 1. Verifica esistenza paziente
        const existingPatient = await db
            .select()
            .from(paziente)
            .where(eq(paziente.idPaziente, idPaziente))
            .limit(1);

        if (existingPatient.length === 0) {
            throw new NotFoundException(`Paziente con ID ${idPaziente} non trovato`);
        }

        // 2. Verifica esistenza psicologo
        const existingPsychologist = await db
            .select()
            .from(psicologo)
            .where(eq(psicologo.codFiscale, idPsicologo))
            .limit(1);

        if (existingPsychologist.length === 0) {
            throw new BadRequestException(`Psicologo con codice fiscale ${idPsicologo} non trovato`);
        }

        // NOTA: Controllo max 8 pazienti rimosso per permettere override manuale da admin
    }

    /**
     * Assegna uno psicologo a un paziente.
     */
    async assegnaPsicologo(idPaziente: string, idPsicologo: string) {
        // Esegui validazione (esistenza)
        await this.validazione(idPaziente, idPsicologo);

        // Recupera il vecchio psicologo prima dell'update
        const currentPatientData = await db
            .select({ idPsicologo: paziente.idPsicologo })
            .from(paziente)
            .where(eq(paziente.idPaziente, idPaziente))
            .limit(1);

        const oldPsicologoId = currentPatientData[0]?.idPsicologo;

        // 3. Update del paziente
        await db
            .update(paziente)
            .set({ idPsicologo: idPsicologo })
            .where(eq(paziente.idPaziente, idPaziente));

        // Se c'era un vecchio psicologo ed è diverso dal nuovo, assegna un nuovo paziente al vecchio psicologo
        if (oldPsicologoId && oldPsicologoId !== idPsicologo) {
            console.log(`Psicologo ${oldPsicologoId} liberato. Assegnazione nuovo paziente dalla coda...`);
            await this.assegnazioneService.assignNextPatientToPsychologist(oldPsicologoId);
        }

        return {
            success: true,
            message: `Psicologo assegnato correttamente al paziente`
        };
    }
}
