import { Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { badge, acquisizioneBadge, questionario, paginaDiario, statoAnimo, domandaForum, rispostaForum } from '../../drizzle/schema.js';
import { eq, sql, and, inArray } from 'drizzle-orm';
import { BadgeUtenteDto } from './dto/badge-utente.dto.js';

// Badge criteria configuration
const BADGE_CRITERIA = {
    // Questionari
    'Primo Questionario': { type: 'questionario_count', threshold: 1 },
    'Cinque Questionari': { type: 'questionario_count', threshold: 5 },
    'Dieci Questionari': { type: 'questionario_count', threshold: 10 },
    'Venticinque Questionari': { type: 'questionario_count', threshold: 25 },
    'Screening Completo': { type: 'screening_complete', threshold: 4 },

    // Diario
    'Prima Nota Diario': { type: 'diario_count', threshold: 1 },
    'Diario Costante': { type: 'diario_count', threshold: 5 },
    'Narratore': { type: 'diario_count', threshold: 10 },
    'Diario Esperto': { type: 'diario_count', threshold: 20 },

    // Stato d'Animo
    'Primo Stato dAnimo': { type: 'mood_count', threshold: 1 },
    'Monitoraggio Umore': { type: 'mood_count', threshold: 10 },
    'Streak Week': { type: 'mood_streak', threshold: 7 },
    'Streak Master': { type: 'mood_streak', threshold: 30 },

    // Forum
    'Prima Domanda Forum': { type: 'forum_question_count', threshold: 1 },
    'Voce Attiva': { type: 'forum_question_count', threshold: 5 },
    'Prima Risposta Ricevuta': { type: 'forum_response_received', threshold: 1 },
} as const;

const INITIAL_QUESTIONNAIRES = ['PHQ-9', 'GAD-7', 'WHO-5', 'PC-PTSD-5'];

@Injectable()
export class BadgeService {
    /**
     * Recupera tutti i badge acquisiti dal paziente
     */
    async getBadgeUtente(userId: string): Promise<BadgeUtenteDto> {
        // LEFT JOIN to get ALL badges, with acquisition data if exists
        const allBadges = await db
            .select({
                nome: badge.nome,
                descrizione: badge.descrizione,
                immagineBadge: badge.immagineBadge,
                dataAcquisizione: acquisizioneBadge.dataAcquisizione,
            })
            .from(badge)
            .leftJoin(
                acquisizioneBadge,
                and(
                    eq(acquisizioneBadge.nomeBadge, badge.nome),
                    eq(acquisizioneBadge.idPaziente, userId)
                )
            );

        const badges = allBadges.map(row => ({
            nome: row.nome,
            descrizione: row.descrizione,
            immagineBadge: row.immagineBadge ?? undefined,
            dataAcquisizione: row.dataAcquisizione ?? undefined, // undefined if not acquired
        }));

        // Count only acquired badges
        const acquiredCount = badges.filter(b => b.dataAcquisizione).length;

        return {
            numeroBadge: acquiredCount,
            badges,
        };
    }

    /**
     * Verifica se il paziente ha già un determinato badge
     */
    async hasBadge(userId: string, badgeName: string): Promise<boolean> {
        const result = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(acquisizioneBadge)
            .where(
                and(
                    eq(acquisizioneBadge.idPaziente, userId),
                    eq(acquisizioneBadge.nomeBadge, badgeName)
                )
            );
        return (result[0]?.count ?? 0) > 0;
    }

    /**
     * Assegna un badge al paziente se non lo possiede già
     * @returns true se il badge è stato assegnato, false se già posseduto
     */
    async awardBadge(userId: string, badgeName: string): Promise<boolean> {
        // Check if already has badge
        if (await this.hasBadge(userId, badgeName)) {
            return false;
        }

        // Award the badge
        await db.insert(acquisizioneBadge).values({
            idPaziente: userId,
            nomeBadge: badgeName,
            dataAcquisizione: new Date(),
        });

        console.log(`Badge "${badgeName}" assegnato al paziente ${userId}`);
        return true;
    }

    /**
     * Verifica tutti i criteri e assegna i badge guadagnati
     * @returns Lista dei nuovi badge assegnati
     */
    async checkAndAwardBadges(userId: string): Promise<string[]> {
        const newBadges: string[] = [];

        // Recupera tutti i conteggi in parallelo
        const [
            questionarioCount,
            screeningTypologies,
            diarioCount,
            moodCount,
            moodStreak,
            forumQuestionCount,
            hasReceivedResponse
        ] = await Promise.all([
            this.getQuestionarioCount(userId),
            this.getCompletedScreeningTypologies(userId),
            this.getDiarioCount(userId),
            this.getMoodCount(userId),
            this.getMoodStreak(userId),
            this.getForumQuestionCount(userId),
            this.hasReceivedForumResponse(userId),
        ]);

        // Controlla ogni badge
        for (const [badgeName, criteria] of Object.entries(BADGE_CRITERIA)) {
            // Skip se già posseduto
            if (await this.hasBadge(userId, badgeName)) {
                continue;
            }

            let earned = false;

            switch (criteria.type) {
                case 'questionario_count':
                    earned = questionarioCount >= criteria.threshold;
                    break;
                case 'screening_complete':
                    earned = screeningTypologies.length >= criteria.threshold;
                    break;
                case 'diario_count':
                    earned = diarioCount >= criteria.threshold;
                    break;
                case 'mood_count':
                    earned = moodCount >= criteria.threshold;
                    break;
                case 'mood_streak':
                    earned = moodStreak >= criteria.threshold;
                    break;
                case 'forum_question_count':
                    earned = forumQuestionCount >= criteria.threshold;
                    break;
                case 'forum_response_received':
                    earned = hasReceivedResponse;
                    break;
            }

            if (earned) {
                await this.awardBadge(userId, badgeName);
                newBadges.push(badgeName);
            }
        }

        return newBadges;
    }

    // ============ HELPER METHODS ============

    private async getQuestionarioCount(userId: string): Promise<number> {
        const result = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(questionario)
            .where(eq(questionario.idPaziente, userId));
        return result[0]?.count ?? 0;
    }

    private async getCompletedScreeningTypologies(userId: string): Promise<string[]> {
        const result = await db
            .select({ nomeTipologia: questionario.nomeTipologia })
            .from(questionario)
            .where(
                and(
                    eq(questionario.idPaziente, userId),
                    inArray(questionario.nomeTipologia, INITIAL_QUESTIONNAIRES)
                )
            )
            .groupBy(questionario.nomeTipologia);
        return result.map(r => r.nomeTipologia);
    }

    private async getDiarioCount(userId: string): Promise<number> {
        const result = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(paginaDiario)
            .where(eq(paginaDiario.idPaziente, userId));
        return result[0]?.count ?? 0;
    }

    private async getMoodCount(userId: string): Promise<number> {
        const result = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId));
        return result[0]?.count ?? 0;
    }

    private async getMoodStreak(userId: string): Promise<number> {
        // Recupera tutte le date con stati d'animo
        const moods = await db
            .select({ date: statoAnimo.dataInserimento })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId));

        if (moods.length === 0) return 0;

        // Crea un set di date uniche (solo giorno)
        const dateSet = new Set<string>();
        for (const m of moods) {
            const d = new Date(m.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            dateSet.add(key);
        }

        // Calcola la streak partendo da oggi
        const today = new Date();
        let streak = 0;

        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            if (dateSet.has(key)) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    private async getForumQuestionCount(userId: string): Promise<number> {
        const result = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(domandaForum)
            .where(eq(domandaForum.idPaziente, userId));
        return result[0]?.count ?? 0;
    }

    private async hasReceivedForumResponse(userId: string): Promise<boolean> {
        // Controlla se esiste almeno una risposta a una domanda del paziente
        const result = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(rispostaForum)
            .innerJoin(domandaForum, eq(rispostaForum.idDomanda, domandaForum.idDomanda))
            .where(eq(domandaForum.idPaziente, userId));
        return (result[0]?.count ?? 0) > 0;
    }
}
