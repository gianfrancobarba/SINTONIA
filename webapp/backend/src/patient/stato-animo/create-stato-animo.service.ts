import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { statoAnimo, paziente } from '../../drizzle/schema.js';
import { CreateStatoAnimoDto } from './dto/create-stato-animo.dto.js';
import { BadgeService } from '../badge/badge.service.js';
import { eq } from 'drizzle-orm';

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
    /**
     * Valida i dati dello stato d'animo
     */
    async validazione(patientId: string, dto: CreateStatoAnimoDto) {
        const errors: string[] = [];

        // Valida Patient ID
        if (!patientId) {
            throw new BadRequestException('ID Paziente obbligatorio');
        }

        const patientExists = await db.select().from(paziente).where(eq(paziente.idPaziente, patientId)).limit(1);
        if (patientExists.length === 0) {
            throw new NotFoundException(`Paziente con ID ${patientId} non trovato`);
        }

        // Valori validi per l'enum umore
        const validMoods = [
            'Felice',
            'Sereno',
            'Energico',
            'Neutro',
            'Stanco',
            'Triste',
            'Ansioso',
            'Arrabbiato',
            'Spaventato',
            'Confuso',
        ];

        // Valida umore (obbligatorio)
        if (!dto.umore || typeof dto.umore !== 'string') {
            errors.push('L\'umore è obbligatorio');
        } else if (!validMoods.includes(dto.umore)) {
            errors.push(
                `L'umore deve essere uno dei seguenti valori: ${validMoods.join(', ')}`
            );
        }

        // Valida intensità (obbligatorio)
        if (dto.intensita === undefined || dto.intensita === null) {
            errors.push('L\'intensità è obbligatoria');
        } else {
            if (typeof dto.intensita !== 'number') {
                errors.push('L\'intensità deve essere un numero');
            } else if (!Number.isInteger(dto.intensita)) {
                errors.push('L\'intensità deve essere un numero intero');
            } else if (dto.intensita < 1 || dto.intensita > 10) {
                errors.push('L\'intensità deve essere compresa tra 1 e 10');
            }
        }

        // Valida note (opzionale)
        if (dto.note !== undefined && dto.note !== null) {
            if (typeof dto.note !== 'string') {
                errors.push('Le note devono essere una stringa di testo');
            } else if (dto.note.length > 500) {
                errors.push('Le note non possono superare i 500 caratteri');
            }
        }

        // Valida dataInserimento (opzionale)
        if (dto.dataInserimento !== undefined && dto.dataInserimento !== null) {
            if (typeof dto.dataInserimento !== 'string') {
                errors.push('La data di inserimento deve essere una stringa');
            } else if (isNaN(Date.parse(dto.dataInserimento))) {
                errors.push('La data di inserimento non è valida');
            }
        }

        if (errors.length > 0) {
            throw new BadRequestException({
                message: 'Errore di validazione',
                errors: errors,
            });
        }

        return true;
    }

    async createStatoAnimo(
        patientId: string,
        dto: CreateStatoAnimoDto
    ): Promise<{ id: string; dataInserimento: Date }> {
        // Esegui validazione
        await this.validazione(patientId, dto);

        // Prepara i valori per l'inserimento
        const values: any = {
            idPaziente: patientId,
            umore: dto.umore,
            intensita: dto.intensita,
        };

        if (dto.note !== undefined && dto.note !== null && dto.note.trim().length > 0) {
            values.note = dto.note.trim();
        }

        if (dto.dataInserimento) {
            values.dataInserimento = new Date(dto.dataInserimento);
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
