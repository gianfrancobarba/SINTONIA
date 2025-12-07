import { Injectable } from '@nestjs/common';
import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { notifica } from '../../drizzle/schema.js';
import { NotificationResponseDto, NotificationCountDto, PaginatedNotificationsDto } from './dto/notification.dto.js';

@Injectable()
export class NotificheService {
    private readonly PAGE_SIZE = 3;

    /**
     * Recupera le notifiche paginate per uno psicologo
     * @param codiceFiscale Codice fiscale dello psicologo
     * @param page Numero della pagina (1-based)
     * @returns Lista paginata delle notifiche
     */
    async getNotifications(codiceFiscale: string, page: number = 1): Promise<PaginatedNotificationsDto> {
        // Conta totale notifiche
        const countResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(notifica)
            .where(eq(notifica.idPsicologo, codiceFiscale));

        const total = countResult[0]?.count || 0;
        const totalPages = Math.ceil(total / this.PAGE_SIZE);
        const offset = (page - 1) * this.PAGE_SIZE;

        // Recupera notifiche paginate
        const notifications = await db
            .select()
            .from(notifica)
            .where(eq(notifica.idPsicologo, codiceFiscale))
            .orderBy(desc(notifica.dataInvio))
            .limit(this.PAGE_SIZE)
            .offset(offset);

        return {
            notifications: notifications.map((n) => ({
                idNotifica: n.idNotifica,
                titolo: n.titolo,
                tipologia: n.tipologia,
                descrizione: n.descrizione,
                dataInvio: n.dataInvio,
                letto: n.letto ?? false,
            })),
            total,
            currentPage: page,
            totalPages,
            pageSize: this.PAGE_SIZE,
        };
    }

    /**
     * Conta le notifiche non lette per uno psicologo
     * @param codiceFiscale Codice fiscale dello psicologo
     * @returns Conteggio delle notifiche non lette
     */
    async getUnreadCount(codiceFiscale: string): Promise<NotificationCountDto> {
        const notifications = await db
            .select()
            .from(notifica)
            .where(eq(notifica.idPsicologo, codiceFiscale));

        const unreadCount = notifications.filter((n) => !n.letto).length;

        return { count: unreadCount };
    }

    /**
     * Segna una notifica come letta
     * @param idNotifica ID della notifica
     */
    async markAsRead(idNotifica: string): Promise<void> {
        await db
            .update(notifica)
            .set({ letto: true })
            .where(eq(notifica.idNotifica, idNotifica));
    }

    /**
     * Segna tutte le notifiche come lette per uno psicologo
     * @param codiceFiscale Codice fiscale dello psicologo
     */
    async markAllAsRead(codiceFiscale: string): Promise<void> {
        await db
            .update(notifica)
            .set({ letto: true })
            .where(eq(notifica.idPsicologo, codiceFiscale));
    }
}

