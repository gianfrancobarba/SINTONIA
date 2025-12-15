import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente } from '../../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';
import { AssegnazioneService } from '../assegnazione/assegnazione.service.js';

@Injectable()
export class TerminaCuraService {
    constructor(private readonly assegnazioneService: AssegnazioneService) { }

    /**
     * Metodo di validazione della richiesta di terminazione cura.
     * Verifica esistenza, autorizzazione e stato del paziente.
     */
    async validazione(idPaziente: string, codiceFiscalePsicologo: string): Promise<{ nome: string; cognome: string }> {
        if (!idPaziente) {
            throw new BadRequestException('ID Paziente obbligatorio');
        }
        if (!codiceFiscalePsicologo) {
            throw new BadRequestException('Codice Fiscale Psicologo obbligatorio');
        }

        // Verifica che il paziente esista
        const pazienteRows = await db
            .select({
                idPaziente: paziente.idPaziente,
                nome: paziente.nome,
                cognome: paziente.cognome,
                idPsicologo: paziente.idPsicologo,
                stato: paziente.stato,
            })
            .from(paziente)
            .where(eq(paziente.idPaziente, idPaziente))
            .limit(1);

        if (pazienteRows.length === 0) {
            throw new NotFoundException(`Paziente con ID ${idPaziente} non trovato`);
        }

        const pazienteData = pazienteRows[0];

        // Verifica che il paziente sia assegnato a questo psicologo
        if (pazienteData.idPsicologo !== codiceFiscalePsicologo) {
            throw new ForbiddenException(
                'Non sei autorizzato a terminare la cura di questo paziente. Il paziente non è assegnato a te.'
            );
        }

        // Verifica che il paziente sia attualmente attivo
        if (!pazienteData.stato) {
            throw new BadRequestException(
                `La cura del paziente ${pazienteData.nome} ${pazienteData.cognome} è già stata terminata`
            );
        }

        return { nome: pazienteData.nome, cognome: pazienteData.cognome };
    }

    /**
     * Termina la cura di un paziente impostando stato = false
     * e assegna il prossimo paziente in coda allo psicologo.
     */
    async terminaCura(idPaziente: string, codiceFiscalePsicologo: string) {
        // Esegui validazione
        const pazienteInfo = await this.validazione(idPaziente, codiceFiscalePsicologo);

        // Imposta il paziente come non attivo (soft delete)
        await db
            .update(paziente)
            .set({ stato: false })
            .where(eq(paziente.idPaziente, idPaziente));

        // Assegna il prossimo paziente in coda allo psicologo
        const nuovoPazienteId = await this.assegnazioneService.assignNextPatientToPsychologist(
            codiceFiscalePsicologo
        );

        return {
            message: 'Cura terminata con successo',
            idPaziente: idPaziente,
            nomePaziente: `${pazienteInfo.nome} ${pazienteInfo.cognome}`,
            nuovoPazienteAssegnato: nuovoPazienteId,
        };
    }
}
