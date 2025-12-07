import { Injectable, ConflictException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { psicologo } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { CreaPsicologoDto } from './dto/crea-psicologo.dto.js';
import { NotificationHelperService } from '../../notifications/notification-helper.service.js';
import { AssegnazioneService } from '../../psi/assegnazione/assegnazione.service.js';

@Injectable()
export class Creazione_psicologo_amministratoreService {
    constructor(
        private readonly notificationHelper: NotificationHelperService,
        private readonly assegnazioneService: AssegnazioneService
    ) { }

    /**
     * Crea un nuovo psicologo nel sistema e gli assegna fino a 8 pazienti dalla coda
     */
    async creaPsicologo(dto: CreaPsicologoDto) {
        // Verifica che il codice fiscale non esista già
        const esistente = await db
            .select()
            .from(psicologo)
            .where(eq(psicologo.codFiscale, dto.codFiscale))
            .limit(1);

        if (esistente.length > 0) {
            throw new ConflictException(
                `Psicologo con codice fiscale ${dto.codFiscale} già esistente`
            );
        }

        // Inserisce il nuovo psicologo con stato attivo e immagine di default
        const nuovoPsicologo = await db
            .insert(psicologo)
            .values({
                codFiscale: dto.codFiscale,
                nome: dto.nome,
                cognome: dto.cognome,
                email: dto.email,
                aslAppartenenza: dto.aslAppartenenza,
                stato: true, // Automaticamente attivo
                immagineProfilo: '/images/psychologist-photo.png', // Immagine di default
            })
            .returning();

        // Assegna fino a 8 pazienti dalla coda al nuovo psicologo
        const pazientiAssegnati = await this.assegnazioneService.assignPatientsToNewPsychologist(
            dto.codFiscale
        );

        // Notifica tutti gli admin del nuovo psicologo
        await this.notificationHelper.notifyAllAdmins(
            'Nuovo psicologo registrato',
            `È stato aggiunto il Dott. ${dto.nome} ${dto.cognome} (${dto.aslAppartenenza}). Pazienti assegnati: ${pazientiAssegnati.length}`,
            'SISTEMA',
        );

        return {
            success: true,
            message: `Psicologo creato con successo. ${pazientiAssegnati.length} pazienti assegnati.`,
            data: nuovoPsicologo[0],
            pazientiAssegnati: pazientiAssegnati.length,
        };
    }
}
