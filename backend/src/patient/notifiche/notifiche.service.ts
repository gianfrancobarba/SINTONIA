import { Injectable } from '@nestjs/common';
import { eq, desc, sql, and, gte } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { notifica, questionario, tipologiaQuestionario, statoAnimo } from '../../drizzle/schema.js';
import { NotificationResponseDto, NotificationCountDto, PaginatedNotificationsDto } from './dto/notification.dto.js';

@Injectable()
export class PatientNotificheService {
    private readonly PAGE_SIZE = 3;

    /**
     * Verifica se il paziente ha questionari da compilare
     */
    private async hasPendingQuestionnaires(idPaziente: string): Promise<boolean> {
        const today = new Date();
        const msPerDay = 1000 * 60 * 60 * 24;

        // Ottieni tutte le tipologie di questionari
        const allTypes = await db
            .select({
                nome: tipologiaQuestionario.nome,
                tempoSomministrazione: tipologiaQuestionario.tempoSomministrazione,
            })
            .from(tipologiaQuestionario);

        for (const tipo of allTypes) {
            const lastCompilation = await db
                .select({ dataCompilazione: questionario.dataCompilazione })
                .from(questionario)
                .where(
                    and(
                        eq(questionario.idPaziente, idPaziente),
                        eq(questionario.nomeTipologia, tipo.nome)
                    )
                )
                .orderBy(desc(questionario.dataCompilazione))
                .limit(1);

            if (lastCompilation.length === 0) {
                return true; // Mai compilato
            }

            const lastDate = new Date(lastCompilation[0].dataCompilazione);
            const daysSince = Math.floor((today.getTime() - lastDate.getTime()) / msPerDay);
            if (daysSince >= tipo.tempoSomministrazione) {
                return true; // È passato abbastanza tempo
            }
        }
        return false;
    }

    /**
     * Verifica se il paziente ha inserito lo stato d'animo oggi
     */
    private async hasMoodToday(idPaziente: string): Promise<boolean> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const moods = await db
            .select()
            .from(statoAnimo)
            .where(
                and(
                    eq(statoAnimo.idPaziente, idPaziente),
                    gte(statoAnimo.dataInserimento, startOfDay)
                )
            )
            .limit(1);

        return moods.length > 0;
    }

    /**
     * Genera notifiche dinamiche per questionari e stato d'animo
     */
    private async getDynamicNotifications(idPaziente: string): Promise<NotificationResponseDto[]> {
        const dynamicNotifications: NotificationResponseDto[] = [];

        // Notifica per questionari pendenti
        const hasPending = await this.hasPendingQuestionnaires(idPaziente);
        if (hasPending) {
            dynamicNotifications.push({
                idNotifica: 'dynamic-questionnaire',
                titolo: 'Compila il questionario di oggi!',
                tipologia: 'QUESTIONARIO',
                descrizione: 'Hai un questionario da compilare. Prenditi qualche minuto per completarlo.',
                dataInvio: new Date(),
                letto: false,
                isDynamic: true,
            });
        }

        // Notifica per stato d'animo mancante
        const hasMood = await this.hasMoodToday(idPaziente);
        if (!hasMood) {
            dynamicNotifications.push({
                idNotifica: 'dynamic-mood',
                titolo: 'Come ti senti oggi?',
                tipologia: 'STATO_ANIMO',
                descrizione: 'Non hai ancora inserito il tuo stato d\'animo di oggi. Fallo ora!',
                dataInvio: new Date(),
                letto: false,
                isDynamic: true,
            });
        }

        return dynamicNotifications;
    }

    /**
     * Recupera le notifiche paginate per un paziente
     * Include notifiche dinamiche (questionari, stato d'animo) + notifiche dal database
     */
    async getNotifications(idPaziente: string, page: number = 1): Promise<PaginatedNotificationsDto> {
        // 1. Recupera notifiche dinamiche (solo prima pagina)
        const dynamicNotifications = page === 1 ? await this.getDynamicNotifications(idPaziente) : [];

        // 2. Recupera notifiche dal database (solo non lette)
        const dbNotifications = await db
            .select()
            .from(notifica)
            .where(and(eq(notifica.idPaziente, idPaziente), eq(notifica.letto, false)))
            .orderBy(desc(notifica.dataInvio));

        const mappedDbNotifications = dbNotifications.map((n) => ({
            idNotifica: n.idNotifica,
            titolo: n.titolo,
            tipologia: n.tipologia,
            descrizione: n.descrizione,
            dataInvio: n.dataInvio,
            letto: n.letto ?? false,
            isDynamic: false,
        }));

        // 3. Combina: dinamiche in cima + database
        const allNotifications = [...dynamicNotifications, ...mappedDbNotifications];
        const total = allNotifications.length;
        const totalPages = Math.ceil(total / this.PAGE_SIZE);
        const offset = (page - 1) * this.PAGE_SIZE;
        const paginatedNotifications = allNotifications.slice(offset, offset + this.PAGE_SIZE);

        return {
            notifications: paginatedNotifications,
            total,
            currentPage: page,
            totalPages,
            pageSize: this.PAGE_SIZE,
        };
    }

    /**
     * Conta le notifiche non lette per un paziente
     * Include le notifiche dinamiche
     */
    async getUnreadCount(idPaziente: string): Promise<NotificationCountDto> {
        // Notifiche dinamiche (sempre non lette)
        const dynamicNotifications = await this.getDynamicNotifications(idPaziente);
        const dynamicCount = dynamicNotifications.length;

        // Notifiche database non lette
        const dbNotifications = await db
            .select()
            .from(notifica)
            .where(eq(notifica.idPaziente, idPaziente));
        const dbUnreadCount = dbNotifications.filter((n) => !n.letto).length;

        return { count: dynamicCount + dbUnreadCount };
    }

    /**
     * Segna una notifica come letta
     */
    async markAsRead(idNotifica: string): Promise<void> {
        // Le notifiche dinamiche non possono essere segnate come lette
        if (idNotifica.startsWith('dynamic-')) {
            return;
        }
        await db
            .update(notifica)
            .set({ letto: true })
            .where(eq(notifica.idNotifica, idNotifica));
    }

    /**
     * Segna tutte le notifiche come lette per un paziente
     */
    async markAllAsRead(idPaziente: string): Promise<void> {
        await db
            .update(notifica)
            .set({ letto: true })
            .where(eq(notifica.idPaziente, idPaziente));
    }
}
