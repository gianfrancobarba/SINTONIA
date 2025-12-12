import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { statoAnimo } from '../../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';
import { UpdateStatoAnimoDto } from './dto/update-stato-animo.dto.js';

/**
 * Service per l'aggiornamento di stati d'animo esistenti
 * 
 * Responsabilità:
 * - Validazione del DTO in ingresso
 * - Verifica che lo stato d'animo esista e appartenga al paziente
 * - Aggiornamento nel database
 * - Restituzione dei dati aggiornati
 */
@Injectable()
export class UpdateStatoAnimoService {
    /**
     * Aggiorna uno stato d'animo esistente del paziente
     * 
     * @param patientId ID del paziente (UUID)
     * @param statoAnimoId ID dello stato d'animo da aggiornare (UUID)
     * @param dto Dati aggiornati dello stato d'animo
     * @returns Oggetto con i dati aggiornati
     * @throws BadRequestException se la validazione fallisce
     * @throws NotFoundException se lo stato d'animo non esiste o non appartiene al paziente
     */
    async updateStatoAnimo(
        patientId: string,
        statoAnimoId: string,
        dto: UpdateStatoAnimoDto
    ): Promise<{ id: string; umore: string; intensita?: number; note?: string; dataInserimento: Date }> {
        // Crea istanza del DTO e valida
        const dtoInstance = Object.assign(new UpdateStatoAnimoDto(), dto);
        const validationErrors = dtoInstance.validate();

        if (validationErrors.length > 0) {
            throw new BadRequestException({
                message: 'Errore di validazione',
                errors: validationErrors,
            });
        }

        // Verifica che lo stato d'animo esista e appartenga al paziente
        const existingRecord = await db
            .select()
            .from(statoAnimo)
            .where(and(
                eq(statoAnimo.idStatoAnimo, statoAnimoId),
                eq(statoAnimo.idPaziente, patientId)
            ))
            .limit(1);

        if (!existingRecord || existingRecord.length === 0) {
            throw new NotFoundException('Stato d\'animo non trovato');
        }

        // Prepara i valori per l'aggiornamento
        const updateValues: any = {
            umore: dto.umore, // Drizzle gestirà il cast all'enum
        };

        // Aggiungi campi opzionali
        // Se intensita è undefined/null, impostiamo esplicitamente a null per rimuoverlo
        if (dto.intensita !== undefined && dto.intensita !== null) {
            updateValues.intensita = dto.intensita;
        } else {
            updateValues.intensita = null;
        }

        // Se note è undefined/null o stringa vuota, impostiamo a null
        if (dto.note !== undefined && dto.note !== null && dto.note.trim().length > 0) {
            updateValues.note = dto.note.trim();
        } else {
            updateValues.note = null;
        }

        // Aggiorna nel database
        const [updatedRecord] = await db
            .update(statoAnimo)
            .set(updateValues)
            .where(eq(statoAnimo.idStatoAnimo, statoAnimoId))
            .returning({
                id: statoAnimo.idStatoAnimo,
                umore: statoAnimo.umore,
                intensita: statoAnimo.intensita,
                note: statoAnimo.note,
                dataInserimento: statoAnimo.dataInserimento,
            });

        if (!updatedRecord) {
            throw new BadRequestException('Impossibile aggiornare lo stato d\'animo');
        }

        return {
            id: updatedRecord.id,
            umore: updatedRecord.umore,
            intensita: updatedRecord.intensita ?? undefined,
            note: updatedRecord.note ?? undefined,
            dataInserimento: updatedRecord.dataInserimento,
        };
    }
}
