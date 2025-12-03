import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import {
    psicologo,
    alertClinico,
    questionario,
    domandaForum,
    rispostaForum,
    paziente,
} from '../../drizzle/schema.js';
import { PsiDashboardResponseDto } from '../dto/psi-dashboard.dto.js';

@Injectable()
export class DashboardService {
    /**
     * Recupera i dati della dashboard dello psicologo
     * @param codiceFiscale Codice fiscale dello psicologo
     * @returns Dati profilo e contatori notifiche
     */
    async getDashboardData(
        codiceFiscale: string,
    ): Promise<PsiDashboardResponseDto> {
        // 1. Recupera dati profilo psicologo
        const psicologoData = await db
            .select()
            .from(psicologo)
            .where(eq(psicologo.codFiscale, codiceFiscale))
            .limit(1);

        if (!psicologoData || psicologoData.length === 0) {
            throw new NotFoundException(
                `Psicologo con CF ${codiceFiscale} non trovato`,
            );
        }

        const psi = psicologoData[0];

        // 2. Conta alert clinici non accettati per questo psicologo
        const alertsCountResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(alertClinico)
            .where(
                and(
                    eq(alertClinico.idPsicologo, codiceFiscale),
                    eq(alertClinico.accettato, false),
                ),
            );
        const alertsCount = alertsCountResult[0]?.count || 0;

        // 3. Conta questionari non revisionati dei pazienti di questo psicologo
        const questionnairesCountResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(questionario)
            .innerJoin(paziente, eq(questionario.idPaziente, paziente.idPaziente))
            .where(
                and(
                    eq(paziente.idPsicologo, codiceFiscale),
                    eq(questionario.revisionato, false),
                ),
            );
        const pendingQuestionnairesCount = questionnairesCountResult[0]?.count || 0;

        // 4. Conta domande forum dei pazienti di questo psicologo senza risposta
        const unreadDistinctQuestions = await db
            .select({ id: domandaForum.idDomanda })
            .from(domandaForum)
            .innerJoin(paziente, eq(domandaForum.idPaziente, paziente.idPaziente))
            .leftJoin(
                rispostaForum,
                and(
                    eq(rispostaForum.idDomanda, domandaForum.idDomanda),
                    eq(rispostaForum.idPsicologo, codiceFiscale),
                ),
            )
            .where(
                and(
                    eq(paziente.idPsicologo, codiceFiscale),
                    isNull(rispostaForum.idRisposta),
                ),
            )
            .groupBy(domandaForum.idDomanda);

        const unreadMessagesCount = unreadDistinctQuestions.length;

        // 5. Componi il DTO di risposta
        return {
            fullName: `Dott. ${psi.nome} ${psi.cognome}`,
            profileImageUrl: psi.immagineProfilo,
            role: `Psicologo ${psi.aslAppartenenza}`,
            alertsCount,
            pendingQuestionnairesCount,
            unreadMessagesCount,
        };
    }
}