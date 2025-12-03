import { Injectable } from '@nestjs/common';
import { HomeDashboardDto } from './dto/home-dashboard.dto.js';
import { db } from '../../drizzle/db.js';
import { paziente, statoAnimo, domandaForum, questionario, tipologiaQuestionario, rispostaForum } from '../../drizzle/schema.js';
import { eq, desc, and } from 'drizzle-orm';


@Injectable()
export class HomeService {
    async getDashboard(userId: string): Promise<HomeDashboardDto> {
        const [firstName, mood, notificationsCount, suggestedPosts, calendarDays, consecutiveDays] = await Promise.all([
            this.getFirstName(userId),
            this.getLastMood(userId),
            this.getPendingQuestionnairesCount(userId),
            this.getSuggestedPosts(),
            this.getCalendarDays(userId),
            this.getConsecutiveMoodDays(userId),
        ]);

        const streakLevel = Math.floor(consecutiveDays / 7);
        const streakProgress = Math.round(((consecutiveDays % 7) / 7) * 100);

        return {
            firstName,
            mood,
            notificationsCount,
            streakLevel,
            streakProgress,
            calendarDays,
            suggestedPosts,
        };
    }

    // Formatter per ottenere YYYY-MM-DD in timezone locale
    private formatLocalDate(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    //Ottieni il nome dell'utente
    private async getFirstName(userId: string): Promise<string> {
        const rows = await db
            .select({ firstName: paziente.nome })
            .from(paziente)
            .where(eq(paziente.idPaziente, userId))
            .limit(1);
        return rows[0]?.firstName ?? 'Utente';
    }
    //Ottieni l'ultimo stato d'umore dell'utente
    private async getLastMood(userId: string): Promise<string> {
        const rows = await db
            .select({ umore: statoAnimo.umore })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId))
            .orderBy(desc(statoAnimo.dataInserimento))
            .limit(1);
        return rows[0]?.umore ?? 'Neutro';
    }
    // Ottieni numero questionari da compilare
    // Logica: conta questionari mai compilati + questionari oltre tempo_somministrazione
    async getPendingQuestionnairesCount(userId: string): Promise<number> {
        const today = new Date();
        const msPerDay = 1000 * 60 * 60 * 24;

        // Ottieni tutte le tipologie di questionari
        const allTypes = await db
            .select({
                nome: tipologiaQuestionario.nome,
                tempoSomministrazione: tipologiaQuestionario.tempoSomministrazione,
            })
            .from(tipologiaQuestionario);

        let count = 0;

        // Per ogni tipologia, verifica se è da compilare
        for (const tipo of allTypes) {
            const lastCompilation = await db
                .select({
                    dataCompilazione: questionario.dataCompilazione,
                })
                .from(questionario)
                .where(
                    and(
                        eq(questionario.idPaziente, userId),
                        eq(questionario.nomeTipologia, tipo.nome)
                    )
                )
                .orderBy(desc(questionario.dataCompilazione))
                .limit(1);

            if (lastCompilation.length === 0) {
                // Mai compilato -> conta
                count++;
            } else {
                // Già compilato -> verifica se è passato abbastanza tempo
                const lastDate = new Date(lastCompilation[0].dataCompilazione);
                const daysSinceLastCompilation = Math.floor(
                    (today.getTime() - lastDate.getTime()) / msPerDay
                );

                if (daysSinceLastCompilation >= tipo.tempoSomministrazione) {
                    // È passato abbastanza tempo -> conta
                    count++;
                }
            }
        }

        return count;
    }
    //Ottieni i post suggeriti
    private async getSuggestedPosts() {
        // Ultime 3 domande che hanno almeno una risposta
        const rows = await db
            .select({
                id: domandaForum.idDomanda,
                category: domandaForum.categoria,
                title: domandaForum.titolo,
                contentSnippet: domandaForum.testo,
                createdAt: domandaForum.dataInserimento,
            })
            .from(domandaForum)
            .innerJoin(rispostaForum, eq(rispostaForum.idDomanda, domandaForum.idDomanda))
            .groupBy(
                domandaForum.idDomanda,
                domandaForum.categoria,
                domandaForum.titolo,
                domandaForum.testo,
                domandaForum.dataInserimento,
            )
            .orderBy(desc(domandaForum.dataInserimento))
            .limit(3);

        return rows.map(({ createdAt, ...post }) => ({
            ...post,
            contentSnippet: post.contentSnippet.substring(0, 50) + (post.contentSnippet.length > 50 ? '...' : ''),
        }));
    }

    private async getCalendarDays(userId: string) {
        // Restituisce SOLO i giorni che hanno almeno uno stato d'animo,
        // includendo l'ultimo umore inserito per ciascuna data.
        const todayStr = this.formatLocalDate(new Date());

        const moods = await db
            .select({ date: statoAnimo.dataInserimento, umore: statoAnimo.umore })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId))
            .orderBy(desc(statoAnimo.dataInserimento));

        // Mappa per data locale (YYYY-MM-DD) -> ultimo umore della giornata
        const moodByDate = new Map<string, string>();
        for (const m of moods) {
            const key = this.formatLocalDate(new Date(m.date));
            if (!moodByDate.has(key)) {
                moodByDate.set(key, m.umore);
            }
        }

        // Trasforma la mappa in array ordinato per data crescente
        const sortedDates = Array.from(moodByDate.keys()).sort();
        const calendarDays = sortedDates.map((dateStr) => {
            const dateObj = new Date(dateStr + 'T00:00:00');
            const dayName = dateObj.toLocaleDateString('it-IT', { weekday: 'short' });
            return {
                day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
                date: dateObj.getDate(),
                fullDate: dateStr,
                hasEvent: true,
                isToday: dateStr === todayStr,
                mood: moodByDate.get(dateStr),
            };
        });

        return calendarDays;
    }

    // Calcola i giorni consecutivi di compilazione stato d'animo fino a oggi (incluso)
    private async getConsecutiveMoodDays(userId: string): Promise<number> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Recupera un numero ragionevole di record per valutare la streak
        const moods = await db
            .select({ date: statoAnimo.dataInserimento })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId))
            .orderBy(desc(statoAnimo.dataInserimento))
            .limit(90);

        const moodSet = new Set(moods.map(m => this.formatLocalDate(new Date(m.date))));

        let consecutive = 0;
        // Partiamo da oggi e torniamo indietro fino a quando troviamo un giorno senza evento
        for (let i = 0; i < 365; i++) { // safety cap
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = this.formatLocalDate(d);
            if (moodSet.has(key)) {
                consecutive += 1;
            } else {
                break;
            }
        }

        return consecutive;
    }
}
