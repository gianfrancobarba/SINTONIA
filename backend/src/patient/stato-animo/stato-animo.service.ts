import { Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { statoAnimo } from '../../drizzle/schema.js';
import { eq, desc } from 'drizzle-orm';
import { UltimoStatoAnimoDto } from './dto/ultimo-stato-animo.dto.js';
import { StoricoStatoAnimoDto } from './dto/storico-stato-animo.dto.js';

/**
 * Service per la gestione degli stati d'animo del paziente
 * 
 * Responsabilità:
 * - Recupero ultimo stato d'animo dal database
 * - Recupero storico stati d'animo con filtro temporale
 * - Formattazione date per visualizzazione grafico
 * 
 * NOTA: Questo service NON accede mai al campo 'score' della tabella paziente
 * (lo score è un dato clinico interno usato solo per la lista d'attesa)
 */
@Injectable()
export class StatoAnimoService {
    /**
     * Recupera l'ultimo stato d'animo inserito dal paziente
     * 
     * Query: SELECT * FROM stato_animo WHERE id_paziente = userId
     *        ORDER BY data_inserimento DESC LIMIT 1
     * 
     * @param userId ID del paziente (UUID)
     * @returns UltimoStatoAnimoDto oppure null se non ci sono stati d'animo
     */
    async getUltimoStatoAnimo(userId: string): Promise<UltimoStatoAnimoDto | null> {
        const rows = await db
            .select({
                umore: statoAnimo.umore,
                intensita: statoAnimo.intensita,
                note: statoAnimo.note,
                dataInserimento: statoAnimo.dataInserimento,
            })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId))
            .orderBy(desc(statoAnimo.dataInserimento))
            .limit(1);

        if (rows.length === 0) {
            return null;  // Paziente non ha ancora inserito stati d'animo
        }

        return {
            umore: rows[0].umore,
            intensita: rows[0].intensita ?? undefined,
            note: rows[0].note ?? undefined,
            dataInserimento: rows[0].dataInserimento,
        };
    }

    /**
     * Recupera lo stato d'animo inserito oggi dal paziente
     * 
     * @param userId ID del paziente
     * @param clientDate Data locale del client in formato YYYY-MM-DD (opzionale, per gestire timezone)
     * @returns Dto con i dati dello stato d'animo o null se non presente
     */
    async getStatoAnimoOggi(userId: string, clientDate?: string): Promise<any | null> {
        // Usa la data del client se fornita, altrimenti calcola per timezone Europe/Rome
        let todayStr: string;

        if (clientDate && /^\d{4}-\d{2}-\d{2}$/.test(clientDate)) {
            todayStr = clientDate;
        } else {
            // Fallback: calcola la data corrente nel timezone Europe/Rome
            const now = new Date();
            // Europe/Rome è UTC+1 (o UTC+2 in estate)
            const romeOffset = this.getRomeOffset(now);
            const romeTime = new Date(now.getTime() + romeOffset * 60000);
            todayStr = this.formatLocalDate(romeTime);
        }

        // Recupera gli ultimi stati d'animo e filtra per data locale
        const rows = await db
            .select()
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId))
            .orderBy(desc(statoAnimo.dataInserimento))
            .limit(10);

        // Filtra per data locale (confronto stringa YYYY-MM-DD)
        const todayMood = rows.find(row => {
            const rowDate = this.formatLocalDate(new Date(row.dataInserimento));
            return rowDate === todayStr;
        });

        if (!todayMood) {
            return null;
        }

        return {
            id: todayMood.idStatoAnimo,
            umore: todayMood.umore,
            intensita: todayMood.intensita,
            note: todayMood.note,
            dataInserimento: todayMood.dataInserimento,
        };
    }

    /**
     * Calcola l'offset in minuti per Europe/Rome
     * CET (inverno) = UTC+60, CEST (estate) = UTC+120
     */
    private getRomeOffset(date: Date): number {
        // Semplificazione: marzo-ottobre = UTC+2, novembre-febbraio = UTC+1
        const month = date.getUTCMonth(); // 0-11
        // L'ora legale va dall'ultima domenica di marzo all'ultima domenica di ottobre
        // Per semplicità: marzo (2) a ottobre (9) = +120, resto = +60
        if (month >= 2 && month <= 9) {
            return 120; // CEST (UTC+2)
        }
        return 60; // CET (UTC+1)
    }

    /**
     * Recupera lo storico degli stati d'animo per visualizzazione grafico
     * 
     * Filtra gli ultimi N giorni e ritorna gli stati in ordine cronologico crescente.
     * Utile per mostrare l'andamento dell'umore nel tempo.
     * 
     * @param userId ID del paziente (UUID)
     * @param giorni Numero di giorni da recuperare (default: 30)
     * @returns StoricoStatoAnimoDto con array di entries ordinate
     */
    async getStoricoStatoAnimo(userId: string, giorni: number = 30): Promise<StoricoStatoAnimoDto> {
        // Calcola la data limite (oggi - N giorni)
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - giorni);

        // Recupera tutti gli stati d'animo del paziente (limite 100 per sicurezza)
        const rows = await db
            .select({
                idStatoAnimo: statoAnimo.idStatoAnimo,
                umore: statoAnimo.umore,
                intensita: statoAnimo.intensita,
                note: statoAnimo.note,
                dataInserimento: statoAnimo.dataInserimento,
            })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId))
            .orderBy(desc(statoAnimo.dataInserimento))
            .limit(100); // Safety limit per evitare query troppo grandi

        // Filtra per data e formatta per il frontend
        const entries = rows
            .filter(row => new Date(row.dataInserimento) >= dataLimite)
            .map(row => ({
                id: row.idStatoAnimo,
                date: this.formatLocalDate(new Date(row.dataInserimento)),
                umore: row.umore,
                intensita: row.intensita ?? undefined,
                note: row.note ?? undefined,
            }))
            .reverse(); // Ordine cronologico crescente (dal passato al presente) per il grafico

        return { entries };
    }

    /**
     * Formatta una data in formato YYYY-MM-DD (timezone locale)
     * 
     * Esempio: new Date('2025-11-29T15:30:00') => "2025-11-29"
     * 
     * @param date Data da formattare
     * @returns Stringa nel formato YYYY-MM-DD
     */
    private formatLocalDate(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
}
