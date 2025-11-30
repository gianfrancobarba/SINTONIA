import { Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { badge, acquisizioneBadge } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { BadgeUtenteDto } from './dto/badge-utente.dto.js';

@Injectable()
export class BadgeService {
    /**
     * Recupera tutti i badge acquisiti dal paziente
     */
    async getBadgeUtente(userId: string): Promise<BadgeUtenteDto> {
        // Recupera i badge acquisiti con JOIN
        const badgeRows = await db
            .select({
                nome: badge.nome,
                descrizione: badge.descrizione,
                immagineBadge: badge.immagineBadge,
                dataAcquisizione: acquisizioneBadge.dataAcquisizione,
            })
            .from(acquisizioneBadge)
            .innerJoin(badge, eq(acquisizioneBadge.nomeBadge, badge.nome))
            .where(eq(acquisizioneBadge.idPaziente, userId));

        const badges = badgeRows.map(row => ({
            nome: row.nome,
            descrizione: row.descrizione,
            immagineBadge: row.immagineBadge ?? undefined,
            dataAcquisizione: row.dataAcquisizione ?? new Date(),
        }));

        return {
            numeroBadge: badges.length,  // Numero totale badge (es: 1 per Chiara)
            badges,
        };
    }
}
