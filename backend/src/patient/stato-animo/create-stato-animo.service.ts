import { Injectable, BadRequestException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { statoAnimo } from '../../drizzle/schema.js';
import { CreateStatoAnimoDto } from './dto/create-stato-animo.dto.js';
import { BadgeService } from '../badge/badge.service.js';

/**
 * Service per la creazione di nuovi stati d'animo
 * 
 * Responsabilità:
 * - Validazione del DTO in ingresso
 * - Inserimento nel database
 * - Restituzione dell'ID del record creato
 */
@Injectable()
export class CreateStatoAnimoService {
    constructor(private readonly badgeService: BadgeService) { }

    /**
     * Crea un nuovo stato d'animo per il paziente
     * 
     * @param patientId ID del paziente (UUID)
     * @param dto Dati dello stato d'animo da creare
     * @returns Oggetto con l'ID del nuovo stato d'animo creato
     * @throws BadRequestException se la validazione fallisce
     */
    async createStatoAnimo(
        patientId: string,
        dto: CreateStatoAnimoDto
    ): Promise<{ id: string; dataInserimento: Date }> {
        // Crea istanza del DTO e valida
        const dtoInstance = Object.assign(new CreateStatoAnimoDto(), dto);
        const validationErrors = dtoInstance.validate();

        if (validationErrors.length > 0) {
            throw new BadRequestException({
                message: 'Errore di validazione',
                errors: validationErrors,
            });
        }

        // Prepara i valori per l'inserimento
        const values: any = {
            idPaziente: patientId,
            umore: dto.umore, // Drizzle gestirà il cast all'enum
        };

        // Aggiungi campi opzionali solo se presenti
        if (dto.intensita !== undefined && dto.intensita !== null) {
            values.intensita = dto.intensita;
        }

        if (dto.note !== undefined && dto.note !== null && dto.note.trim().length > 0) {
            values.note = dto.note.trim();
        }

        // Inserisci nel database
        const [insertedRecord] = await db
            .insert(statoAnimo)
            .values(values)
            .returning({
                id: statoAnimo.idStatoAnimo,
                dataInserimento: statoAnimo.dataInserimento,
            });

        if (!insertedRecord) {
            throw new BadRequestException('Impossibile creare lo stato d\'animo');
        }

        // Controlla e assegna badge guadagnati
        await this.badgeService.checkAndAwardBadges(patientId);

        return {
            id: insertedRecord.id,
            dataInserimento: insertedRecord.dataInserimento,
        };
    }
}
