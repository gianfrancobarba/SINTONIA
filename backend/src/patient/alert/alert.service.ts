import { Injectable } from '@nestjs/common';
import { eq, and, gte, sql } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { alertClinico, questionario, paziente } from '../../drizzle/schema.js';
import { AlertClinicoDto } from './dto/alert.dto.js';
import { NotificationHelperService } from '../../notifications/notification-helper.service.js';

@Injectable()
export class AlertService {
    private readonly SOGLIA_ALERT = 80; // Score >= 80 genera alert
    private readonly SCREENING_QUESTIONNAIRES = ['PHQ-9', 'GAD-7', 'WHO-5', 'PC-PTSD-5'];

    constructor(private readonly notificationHelper: NotificationHelperService) { }

    /**
     * Verifica se il paziente ha completato lo screening iniziale
     */
    private async hasCompletedScreening(idPaziente: string): Promise<boolean> {
        for (const nomeQuestionario of this.SCREENING_QUESTIONNAIRES) {
            const result = await db
                .select({ count: sql<number>`count(*)::int` })
                .from(questionario)
                .where(
                    and(
                        eq(questionario.idPaziente, idPaziente),
                        eq(questionario.nomeTipologia, nomeQuestionario)
                    )
                )
                .limit(1);

            const count = result[0]?.count || 0;
            if (count === 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * Verifica se il paziente ha già un alert nell'ultimo mese
     */
    private async hasAlertInLastMonth(idPaziente: string): Promise<boolean> {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const alerts = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(alertClinico)
            .where(
                and(
                    eq(alertClinico.idPaziente, idPaziente),
                    gte(alertClinico.dataAlert, oneMonthAgo)
                )
            );

        return (alerts[0]?.count || 0) > 0;
    }

    /**
     * Crea un alert clinico se necessario
     * 
     * Condizioni:
     * 1. Score del questionario >= 80
     * 2. Screening iniziale completato
     * 3. Nessun alert nell'ultimo mese
     * 
     * Inserisce solo: dataAlert (automatica) e idPaziente
     */
    async createAlertIfNeeded(idPaziente: string, scoreQuestionario: number): Promise<void> {
        // 1. Verifica soglia score
        if (scoreQuestionario < this.SOGLIA_ALERT) {
            return; // Score troppo basso, nessun alert
        }

        // 2. Verifica screening completato
        const screeningCompleto = await this.hasCompletedScreening(idPaziente);
        if (!screeningCompleto) {
            return; // Screening non completo, nessun alert
        }

        // 3. Verifica che non ci sia già un alert nell'ultimo mese
        const hasRecentAlert = await this.hasAlertInLastMonth(idPaziente);
        if (hasRecentAlert) {
            console.log(`Alert già presente per paziente ${idPaziente} nell'ultimo mese`);
            return; // Alert già presente, non creare duplicato
        }

        // 4. Crea alert clinico
        // Inserisce solo idPaziente, dataAlert è automatica, accettato resta default
        await db.insert(alertClinico).values({
            idPaziente,
            // dataAlert: automatico (defaultNow)
            // accettato: default (false)
            // idPsicologo: NON inserito
        });

        console.log(`Alert clinico creato per paziente ${idPaziente} con score ${scoreQuestionario}`);

        // 5. Notifica lo psicologo del paziente
        const patientData = await db
            .select({ idPsicologo: paziente.idPsicologo })
            .from(paziente)
            .where(eq(paziente.idPaziente, idPaziente))
            .limit(1);

        if (patientData.length > 0 && patientData[0].idPsicologo) {
            await this.notificationHelper.notifyPsicologo(
                patientData[0].idPsicologo,
                'Nuovo alert clinico',
                `È stato generato un alert clinico per un tuo paziente (score: ${scoreQuestionario}%). Verifica nella sezione Alert.`,
                'ALERT',
            );
        }
    }

    /**
     * Ottiene tutti gli alert di un paziente
     */
    async getPatientAlerts(idPaziente: string): Promise<AlertClinicoDto[]> {
        const alerts = await db
            .select({
                idAlert: alertClinico.idAlert,
                dataAlert: alertClinico.dataAlert,
                idPaziente: alertClinico.idPaziente,
            })
            .from(alertClinico)
            .where(eq(alertClinico.idPaziente, idPaziente))
            .orderBy(alertClinico.dataAlert);

        return alerts.map(a => ({
            idAlert: a.idAlert,
            dataAlert: a.dataAlert as Date,
            idPaziente: a.idPaziente,
        }));
    }
}
