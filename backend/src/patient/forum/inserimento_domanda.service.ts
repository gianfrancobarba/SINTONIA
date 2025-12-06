import { Injectable, BadRequestException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { domandaForum, paziente } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { InserisciDomandaDto, DomandaInseritaDto } from './dto/inserimento_domanda.dto.js';
import { NotificationHelperService } from '../../notifications/notification-helper.service.js';

@Injectable()
export class InserimentoDomandaService {
    constructor(private readonly notificationHelper: NotificationHelperService) { }

    /**
     * Inserisce una nuova domanda nel forum
     * @param idPaziente - ID del paziente che crea la domanda
     * @param dto - Dati della domanda (titolo, testo, categoria)
     * @returns Conferma inserimento con ID della domanda creata
     */
    async inserisciDomanda(
        idPaziente: string,
        dto: InserisciDomandaDto
    ): Promise<DomandaInseritaDto> {
        // Crea istanza della classe e copia proprietà
        const dtoInstance = Object.assign(new InserisciDomandaDto(), dto);

        // Validazione DTO
        const validationErrors = dtoInstance.validate();
        if (validationErrors.length > 0) {
            throw new BadRequestException(validationErrors.join(', '));
        }

        // Inserimento nella tabella domanda_forum
        const inserted = await db
            .insert(domandaForum)
            .values({
                idPaziente,
                titolo: dto.titolo.trim(),
                testo: dto.testo.trim(),
                categoria: dto.categoria.trim(),
                // dataInserimento viene generato automaticamente dal database
            })
            .returning({ id: domandaForum.idDomanda });

        const idDomanda = inserted[0]?.id;

        if (!idDomanda) {
            throw new Error('Impossibile inserire la domanda nel forum');
        }

        // Recupera lo psicologo del paziente e notificalo
        const patientData = await db
            .select({ idPsicologo: paziente.idPsicologo })
            .from(paziente)
            .where(eq(paziente.idPaziente, idPaziente))
            .limit(1);

        if (patientData.length > 0 && patientData[0].idPsicologo) {
            await this.notificationHelper.notifyPsicologo(
                patientData[0].idPsicologo,
                'Nuova domanda nel forum',
                `Un tuo paziente ha pubblicato una domanda: "${dto.titolo.trim()}"`,
                'FORUM',
            );
        }

        return {
            success: true,
            idDomanda,
            message: 'Domanda pubblicata con successo nel forum',
        };
    }
}

