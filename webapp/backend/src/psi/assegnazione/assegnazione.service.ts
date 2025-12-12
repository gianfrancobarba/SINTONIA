import { Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente, priorita, questionario, psicologo } from '../../drizzle/schema.js';
import { eq, sql, isNull, and, desc } from 'drizzle-orm';

const MAX_PATIENTS_PER_PSYCHOLOGIST = 8;

@Injectable()
export class AssegnazioneService {
    /**
     * Calcola la data di scadenza per un paziente
     * Data_Scadenza = Data_Base + finestra_temporale
     * 
     * Data_Base = ultimo questionario con cambiamento=true OPPURE data_ingresso
     */
    private async getPatientExpirationDate(patientId: string): Promise<Date> {
        // Recupera data ultimo questionario con cambiamento
        const lastChangeQuestionario = await db
            .select({ dataCompilazione: questionario.dataCompilazione })
            .from(questionario)
            .where(
                and(
                    eq(questionario.idPaziente, patientId),
                    eq(questionario.cambiamento, true)
                )
            )
            .orderBy(desc(questionario.dataCompilazione))
            .limit(1);

        // Recupera dati paziente
        const patientData = await db
            .select({
                dataIngresso: paziente.dataIngresso,
                idPriorita: paziente.idPriorita,
            })
            .from(paziente)
            .where(eq(paziente.idPaziente, patientId))
            .limit(1);

        if (!patientData.length) {
            throw new Error(`Paziente ${patientId} non trovato`);
        }

        // Recupera finestra temporale dalla priorità
        const prioritaData = await db
            .select({ finestraTemporale: priorita.finestraTemporale })
            .from(priorita)
            .where(eq(priorita.nome, patientData[0].idPriorita))
            .limit(1);

        if (!prioritaData.length) {
            throw new Error(`Priorità ${patientData[0].idPriorita} non trovata`);
        }

        // Determina data base
        const dataBase = lastChangeQuestionario.length > 0
            ? new Date(lastChangeQuestionario[0].dataCompilazione)
            : new Date(patientData[0].dataIngresso);

        // Calcola data scadenza
        const finestraGiorni = prioritaData[0].finestraTemporale;
        const dataScadenza = new Date(dataBase);
        dataScadenza.setDate(dataScadenza.getDate() + finestraGiorni);

        return dataScadenza;
    }

    /**
     * Ottiene la coda virtuale dei pazienti non assegnati, ordinata per data scadenza
     * @returns Array di pazienti con data_scadenza calcolata, ordinati ASC
     */
    async getQueuedPatients(): Promise<Array<{
        idPaziente: string;
        nome: string;
        cognome: string;
        idPriorita: string;
        dataScadenza: Date;
    }>> {
        // Recupera tutti i pazienti non assegnati E attivi
        const unassignedPatients = await db
            .select({
                idPaziente: paziente.idPaziente,
                nome: paziente.nome,
                cognome: paziente.cognome,
                idPriorita: paziente.idPriorita,
            })
            .from(paziente)
            .where(
                and(
                    isNull(paziente.idPsicologo),
                    eq(paziente.stato, true)
                )
            );

        // Calcola data scadenza per ciascun paziente
        const patientsWithExpiration = await Promise.all(
            unassignedPatients.map(async (p) => ({
                ...p,
                dataScadenza: await this.getPatientExpirationDate(p.idPaziente),
            }))
        );

        // Ordina per data scadenza ASC (chi scade prima = priorità maggiore)
        return patientsWithExpiration.sort(
            (a, b) => a.dataScadenza.getTime() - b.dataScadenza.getTime()
        );
    }

    /**
     * Ottiene il primo paziente in coda (quello con data scadenza minore)
     * @returns Il paziente con priorità massima oppure null se coda vuota
     */
    async getNextPatientInQueue(): Promise<{
        idPaziente: string;
        nome: string;
        cognome: string;
        idPriorita: string;
        dataScadenza: Date;
    } | null> {
        const queue = await this.getQueuedPatients();
        return queue.length > 0 ? queue[0] : null;
    }

    /**
     * Conta quanti pazienti ATTIVI ha attualmente uno psicologo
     */
    async getPsychologistPatientCount(psychologistId: string): Promise<number> {
        const result = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(paziente)
            .where(
                and(
                    eq(paziente.idPsicologo, psychologistId),
                    eq(paziente.stato, true)
                )
            );
        return result[0]?.count ?? 0;
    }

    /**
     * Verifica se uno psicologo può ricevere nuovi pazienti
     */
    async canPsychologistReceivePatients(psychologistId: string): Promise<boolean> {
        const currentCount = await this.getPsychologistPatientCount(psychologistId);
        return currentCount < MAX_PATIENTS_PER_PSYCHOLOGIST;
    }

    /**
     * Assegna un paziente a uno psicologo
     * @returns true se assegnazione riuscita, false se psicologo al massimo
     */
    async assignPatientToPsychologist(
        patientId: string,
        psychologistId: string
    ): Promise<boolean> {
        // Verifica capacità psicologo
        if (!await this.canPsychologistReceivePatients(psychologistId)) {
            console.log(`Psicologo ${psychologistId} ha già ${MAX_PATIENTS_PER_PSYCHOLOGIST} pazienti`);
            return false;
        }

        // Assegna paziente
        await db
            .update(paziente)
            .set({ idPsicologo: psychologistId })
            .where(eq(paziente.idPaziente, patientId));

        console.log(`Paziente ${patientId} assegnato a psicologo ${psychologistId}`);
        return true;
    }

    /**
     * Assegna il primo paziente in coda a uno psicologo
     * Chiamato quando uno psicologo termina una cura
     * @returns ID del paziente assegnato oppure null
     */
    async assignNextPatientToPsychologist(psychologistId: string): Promise<string | null> {
        // Verifica capacità
        if (!await this.canPsychologistReceivePatients(psychologistId)) {
            console.log(`Psicologo ${psychologistId} ha raggiunto il limite di pazienti`);
            return null;
        }

        // Ottieni primo in coda
        const nextPatient = await this.getNextPatientInQueue();
        if (!nextPatient) {
            console.log('Nessun paziente in coda');
            return null;
        }

        // Assegna
        await this.assignPatientToPsychologist(nextPatient.idPaziente, psychologistId);
        return nextPatient.idPaziente;
    }

    /**
     * Assegna più pazienti a un nuovo psicologo (fino a 8)
     * Chiamato quando viene inserito un nuovo psicologo
     * @returns Array di ID pazienti assegnati
     */
    async assignPatientsToNewPsychologist(
        psychologistId: string,
        count: number = MAX_PATIENTS_PER_PSYCHOLOGIST
    ): Promise<string[]> {
        const assignedPatients: string[] = [];

        // Limita al massimo consentito
        const maxToAssign = Math.min(count, MAX_PATIENTS_PER_PSYCHOLOGIST);

        for (let i = 0; i < maxToAssign; i++) {
            const assignedId = await this.assignNextPatientToPsychologist(psychologistId);
            if (assignedId) {
                assignedPatients.push(assignedId);
            } else {
                // Coda vuota o psicologo al massimo
                break;
            }
        }

        console.log(`Assegnati ${assignedPatients.length} pazienti al nuovo psicologo ${psychologistId}`);
        return assignedPatients;
    }

    /**
     * Termina la cura di un paziente e assegna il prossimo in coda
     * @returns ID del nuovo paziente assegnato oppure null
     */
    async terminaCuraEAssegna(
        patientIdTerminato: string,
        psychologistId: string
    ): Promise<string | null> {
        // Rimuovi assegnazione paziente corrente
        await db
            .update(paziente)
            .set({ idPsicologo: null })
            .where(eq(paziente.idPaziente, patientIdTerminato));

        console.log(`Cura terminata per paziente ${patientIdTerminato}`);

        // Assegna prossimo in coda
        return this.assignNextPatientToPsychologist(psychologistId);
    }

    /**
     * Verifica se uno psicologo esiste e è attivo
     */
    async isPsychologistActive(psychologistId: string): Promise<boolean> {
        const result = await db
            .select({ stato: psicologo.stato })
            .from(psicologo)
            .where(eq(psicologo.codFiscale, psychologistId))
            .limit(1);
        return result.length > 0 && result[0].stato === true;
    }
}
