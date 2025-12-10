import { Injectable, BadRequestException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { domandaForum } from '../../drizzle/schema.js';
import { InserisciDomandaDto, DomandaInseritaDto } from './dto/inserimento_domanda.dto.js';
import { BadgeService } from '../badge/badge.service.js';

@Injectable()
export class InserimentoDomandaService {
    constructor(private readonly badgeService: BadgeService) { }

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

        await this.validazione(dto);

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

        // Controlla e assegna badge guadagnati
        await this.badgeService.checkAndAwardBadges(idPaziente);

        return {
            success: true,
            idDomanda,
            message: 'Domanda pubblicata con successo nel forum',
        };
    }

    async validazione(dto: InserisciDomandaDto) {
        // Crea istanza della classe e copia proprietà
        const dtoInstance = Object.assign(new InserisciDomandaDto(), dto);

        // Validazione
        if (!dtoInstance.titolo || dtoInstance.titolo.trim().length === 0) {
            throw new BadRequestException('Il titolo è obbligatorio');
        } else if (dtoInstance.titolo.length > 64) {
            throw new BadRequestException('Il titolo non può superare 64 caratteri');
        }

        if (!dtoInstance.testo || dtoInstance.testo.trim().length === 0) {
            throw new BadRequestException('Il testo è obbligatorio');
        }

        if (!dtoInstance.categoria || dtoInstance.categoria.trim().length === 0) {
            throw new BadRequestException('La categoria è obbligatoria');
        } else if (dtoInstance.categoria.length > 128) {
            throw new BadRequestException('La categoria non può superare 128 caratteri');
        }

        // Categorie ammesse
        const allowedCategories = ['Vita di Coppia', 'Stress', 'Ansia', 'Rabbia'];
        // Normalizza la categoria input (es. rimuove spazi extra, ma mantiene case-sensitive o no? 
        // User requirements use specific casing. Let's match strictly or allow slight variation if needed.
        // Given Oracle uses "Vita di Coppia", let's be strict or use simple comparison.

        if (!allowedCategories.includes(dtoInstance.categoria.trim())) {
            throw new BadRequestException('Categoria non valida');
        }
    }
}
