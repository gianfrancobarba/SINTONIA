import { Injectable } from '@nestjs/common';
import { eq, and, gt, desc, lt, gte } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { questionario, paziente } from '../../drizzle/schema.js';
import { ScoreService } from '../../patient/score/score.service.js';
import { PrioritaService } from '../../patient/priorita/priorita.service.js';
import { NotificationHelperService } from '../../notifications/notification-helper.service.js';

@Injectable()
export class Accettazione_invalidazioneService {
    constructor(
        private readonly scoreService: ScoreService,
        private readonly prioritaService: PrioritaService,
        private readonly notificationHelper: NotificationHelperService,
    ) { }

    /**
     * Trova il questionario PRECEDENTE con cambiamento=true
     */
    private async trovaQuestionarioPrecedenteConCambiamento(
        idPaziente: string,
        dataQuestionarioInvalidato: Date
    ): Promise<{ id: string; data: Date } | null> {
        const precedente = await db
            .select({
                id: questionario.idQuestionario,
                data: questionario.dataCompilazione
            })
            .from(questionario)
            .where(
                and(
                    eq(questionario.idPaziente, idPaziente),
                    lt(questionario.dataCompilazione, dataQuestionarioInvalidato),
                    eq(questionario.cambiamento, true),
                    eq(questionario.invalidato, false)
                )
            )
            .orderBy(desc(questionario.dataCompilazione))
            .limit(1);

        return precedente[0] || null;
    }

    /**
     * Ricalcola score incrementalmente da un punto di partenza
     * Aggiunge un questionario alla volta e verifica se raggiunge la fascia attuale
     */
    private async ricalcolaScoreIncrementale(
        idPaziente: string,
        dataInizio: Date
    ): Promise<boolean> {
        // 1. Ottieni priorità attuale
        const pazienteData = await db.query.paziente.findFirst({
            where: eq(paziente.idPaziente, idPaziente)
        });

        if (!pazienteData) {
            throw new Error(`Paziente con ID ${idPaziente} non trovato`);
        }

        const prioritaAttuale = pazienteData.idPriorita;
        const fasce = await this.prioritaService.getFasciaPriorita(prioritaAttuale);
        const scoreMin = fasce.punteggioInizio;

        // 2. Ottieni tutti i questionari da dataInizio in poi (esclusi invalidati)
        const questionariDaRicalcolare = await db
            .select({
                id: questionario.idQuestionario,
                data: questionario.dataCompilazione
            })
            .from(questionario)
            .where(
                and(
                    eq(questionario.idPaziente, idPaziente),
                    gte(questionario.dataCompilazione, dataInizio),
                    eq(questionario.invalidato, false)
                )
            )
            .orderBy(questionario.dataCompilazione);

        let raggiuntaFascia = false;

        // 3. Ricalcola incrementalmente
        for (let i = 0; i < questionariDaRicalcolare.length; i++) {
            const q = questionariDaRicalcolare[i];

            // Calcola score PRIMA e DOPO il questionario (Time Travel)
            const dataPre = new Date(q.data.getTime() - 1000); // 1 secondo prima
            const scorePre = await this.scoreService.calculatePatientScore(idPaziente, dataPre);
            const scorePost = await this.scoreService.calculatePatientScore(idPaziente, q.data);

            const preVal = scorePre || 0;
            const postVal = scorePost || 0;

            // Verifica se raggiunge la fascia attuale
            if (postVal >= scoreMin) {
                raggiuntaFascia = true;

                // Se prima non raggiungeva la fascia, è un cambiamento
                if (preVal < scoreMin) {
                    await db.update(questionario)
                        .set({ cambiamento: true })
                        .where(eq(questionario.idQuestionario, q.id));
                } else {
                    // Se già raggiungeva la fascia, NON è un cambiamento (resetta flag se presente)
                    await db.update(questionario)
                        .set({ cambiamento: false })
                        .where(eq(questionario.idQuestionario, q.id));
                }
            }
            // Se non raggiunge la fascia, non tocchiamo il flag (potrebbe essere un cambiamento per una fascia inferiore)
        }

        return raggiuntaFascia;
    }

    /**
     * Forza il downgrade della priorità di una fascia
     */
    private async downgradePriorita(idPaziente: string): Promise<void> {
        const pazienteData = await db.query.paziente.findFirst({
            where: eq(paziente.idPaziente, idPaziente),
        });

        if (!pazienteData) {
            throw new Error(`Paziente con ID ${idPaziente} non trovato`);
        }

        const prioritaAttuale = pazienteData.idPriorita;

        const downgradeMap: Record<string, string> = {
            'Urgente': 'Breve',
            'Breve': 'Differibile',
            'Differibile': 'Programmabile',
            'Programmabile': 'Programmabile',
        };

        const nuovaPriorita = downgradeMap[prioritaAttuale] || 'Programmabile';

        await db
            .update(paziente)
            .set({ idPriorita: nuovaPriorita as any })
            .where(eq(paziente.idPaziente, idPaziente));

        console.log(`Priorità downgrade: ${prioritaAttuale} → ${nuovaPriorita}`);
    }

    /**
     * Accetta richiesta di invalidazione con ricalcolo incrementale
     */
    async accettaRichiestaInvalidazione(
        idQuestionario: string,
        emailAmministratore: string,
    ): Promise<void> {
        // 1. Ottieni questionario da invalidare
        const quest = await db.query.questionario.findFirst({
            where: eq(questionario.idQuestionario, idQuestionario)
        });

        if (!quest) throw new Error('Questionario non trovato');

        const idPaziente = quest.idPaziente;
        const dataQuestionario = new Date(quest.dataCompilazione);

        // 2. Invalida questionario e reset cambiamento
        await db.update(questionario).set({
            invalidato: true,
            dataInvalidazione: new Date(),
            idAmministratoreConferma: emailAmministratore,
            cambiamento: false,
        }).where(eq(questionario.idQuestionario, idQuestionario));

        // 2b. Notifica lo psicologo che ha richiesto l'invalidazione
        if (quest.idPsicologoRichiedente) {
            await this.notificationHelper.notifyPsicologo(
                quest.idPsicologoRichiedente,
                'Richiesta di invalidazione accettata',
                'La tua richiesta di invalidazione questionario è stata accettata.',
                'INVALIDAZIONE',
            );
        }

        // 3. Trova questionario PRECEDENTE con cambiamento=true
        const precedente = await this.trovaQuestionarioPrecedenteConCambiamento(
            idPaziente,
            dataQuestionario
        );

        if (!precedente) {
            // Nessun precedente con cambiamento, ricalcola semplicemente
            const ultimoValido = await db.query.questionario.findFirst({
                where: and(
                    eq(questionario.idPaziente, idPaziente),
                    eq(questionario.invalidato, false)
                ),
                orderBy: desc(questionario.dataCompilazione)
            });

            if (ultimoValido) {
                await this.scoreService.updatePatientScore(
                    idPaziente,
                    ultimoValido.idQuestionario
                );
            }
            return;
        }

        // 4. Ricalcola incrementalmente da precedente
        const raggiuntaFascia = await this.ricalcolaScoreIncrementale(
            idPaziente,
            precedente.data
        );

        // 5. Se non raggiunge fascia attuale → downgrade
        if (!raggiuntaFascia) {
            await this.downgradePriorita(idPaziente);
        }

        // 6. Ricalcola score finale
        const ultimoValido = await db.query.questionario.findFirst({
            where: and(
                eq(questionario.idPaziente, idPaziente),
                eq(questionario.invalidato, false)
            ),
            orderBy: desc(questionario.dataCompilazione)
        });

        if (ultimoValido) {
            await this.scoreService.updatePatientScore(
                idPaziente,
                ultimoValido.idQuestionario
            );
        }
    }
}
