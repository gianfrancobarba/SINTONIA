import { Injectable } from '@nestjs/common';
import { db } from '../drizzle/db.js';
import { notifica, amministratore } from '../drizzle/schema.js';

@Injectable()
export class NotificationHelperService {
    /**
     * Crea una notifica per tutti gli amministratori
     */
    async notifyAllAdmins(
        titolo: string,
        descrizione: string,
        tipologia: string,
    ): Promise<void> {
        try {
            // Recupera tutti gli admin
            const admins = await db.select().from(amministratore);

            // Crea una notifica per ogni admin
            for (const admin of admins) {
                await db.insert(notifica).values({
                    titolo,
                    descrizione,
                    tipologia,
                    idAmministratore: admin.email,
                    letto: false,
                });
            }
        } catch (error) {
            console.error('Errore nella creazione notifica admin:', error);
            // Non blocchiamo l'operazione principale se la notifica fallisce
        }
    }

    /**
     * Crea una notifica per uno psicologo specifico
     */
    async notifyPsicologo(
        codiceFiscale: string,
        titolo: string,
        descrizione: string,
        tipologia: string,
    ): Promise<void> {
        try {
            await db.insert(notifica).values({
                titolo,
                descrizione,
                tipologia,
                idPsicologo: codiceFiscale,
                letto: false,
            });
        } catch (error) {
            console.error('Errore nella creazione notifica psicologo:', error);
        }
    }

    /**
     * Crea una notifica per un amministratore specifico
     */
    async notifyAdmin(
        email: string,
        titolo: string,
        descrizione: string,
        tipologia: string,
    ): Promise<void> {
        try {
            await db.insert(notifica).values({
                titolo,
                descrizione,
                tipologia,
                idAmministratore: email,
                letto: false,
            });
        } catch (error) {
            console.error('Errore nella creazione notifica admin:', error);
        }
    }

    /**
     * Crea una notifica per un paziente specifico
     */
    async notifyPaziente(
        idPaziente: string,
        titolo: string,
        descrizione: string,
        tipologia: string,
    ): Promise<void> {
        try {
            await db.insert(notifica).values({
                titolo,
                descrizione,
                tipologia,
                idPaziente,
                letto: false,
            });
        } catch (error) {
            console.error('Errore nella creazione notifica paziente:', error);
        }
    }
}
