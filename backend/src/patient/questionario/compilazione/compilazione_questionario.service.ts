import { Injectable } from '@nestjs/common';
import { db } from '../../../drizzle/db.js';
import { questionario, tipologiaQuestionario } from '../../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { ScoreService } from '../../score/score.service.js';
import { AlertService } from '../../alert/alert.service.js';

@Injectable()
export class Compilazione_questionarioService {
    constructor(
        private readonly scoreService: ScoreService,
        private readonly alertService: AlertService,
    ) { }
    // Metodo per ottenere un questionario specifico con le sue domande dalla tipologia_questionario
    async getQuestionarioDto(idQuestionario: string): Promise<{
        idQuestionario: string;
        nomeTipologia: string;
        tempoSomministrazione: number;
        domande: Array<{ id: string; testo: string; tipo: 'scala' | 'testo' | 'multipla'; scalaMin?: number; scalaMax?: number; opzioni?: string[] }>;
    }> {
        console.log(`getQuestionarioDto called with id: ${idQuestionario}`);
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idQuestionario);
        let nomeTipologia = '';

        if (isUuid) {
            console.log('Input is UUID');
            // Se è un UUID, cerchiamo nella tabella questionario
            const qs = await db
                .select({ id: questionario.idQuestionario, nomeTipologia: questionario.nomeTipologia })
                .from(questionario)
                .where(eq(questionario.idQuestionario, idQuestionario))
                .limit(1);

            if (!qs.length) {
                console.error('Questionario not found for UUID:', idQuestionario);
                throw new Error('Questionario non trovato');
            }
            nomeTipologia = qs[0].nomeTipologia as string;
        } else {
            console.log('Input is NOT UUID, assuming typology name');
            // Se NON è un UUID, assumiamo sia il nome della tipologia (per anteprima/compilazione nuova)
            nomeTipologia = idQuestionario;
        }

        console.log(`Looking for typology: ${nomeTipologia}`);

        // prendi la tipologia per ottenere domande e tempoSomministrazione
        const tipo = await db
            .select({
                domande: tipologiaQuestionario.domande,
                tempo: tipologiaQuestionario.tempoSomministrazione,
                punteggio: tipologiaQuestionario.punteggio,
                campi: tipologiaQuestionario.campi,
            })
            .from(tipologiaQuestionario)
            .where(eq(tipologiaQuestionario.nome, nomeTipologia))
            .limit(1);

        if (!tipo.length) {
            console.error(`Typology not found: ${nomeTipologia}`);
            throw new Error('Tipologia non trovata');
        }

        console.log('Typology found, processing questions...');

        let rawDomande = tipo[0].domande;
        console.log('Raw domande type:', typeof rawDomande);
        console.log('Raw domande content:', JSON.stringify(rawDomande, null, 2));

        // Parse risposte (answer options)
        let rawCampi = tipo[0].campi;
        console.log('Raw campi type:', typeof rawCampi);
        console.log('Raw campi content:', JSON.stringify(rawCampi, null, 2));

        let opzioniRisposta: string[] = [];

        if (typeof rawCampi === 'string' && rawCampi.includes(';')) {
            console.log('Parsing semicolon-separated answer options from campi');
            opzioniRisposta = rawCampi.split(';').map(r => r.trim()).filter(r => r.length > 0);
        } else if (Array.isArray(rawCampi)) {
            opzioniRisposta = rawCampi.map(r => String(r));
        }

        console.log('Parsed answer options:', opzioniRisposta);

        let domandeArray: any[] = [];

        if (typeof rawDomande === 'string') {
            // If it's a string, check if it's semicolon-separated questions
            if (rawDomande.includes(';')) {
                console.log('Parsing semicolon-separated questions');
                const questions = rawDomande.split(';').map(q => q.trim()).filter(q => q.length > 0);
                domandeArray = questions.map((testo, idx) => ({
                    id: `q${idx + 1}`,
                    testo: testo,
                    tipo: 'scala' as const,
                    scalaMin: 0,
                    scalaMax: opzioniRisposta.length > 0 ? opzioniRisposta.length - 1 : 3,
                    opzioni: opzioniRisposta.length > 0 ? opzioniRisposta : undefined
                }));
            } else {
                // Try to parse as JSON
                try {
                    rawDomande = JSON.parse(rawDomande);
                    if (Array.isArray(rawDomande)) {
                        domandeArray = rawDomande;
                    }
                } catch (e) {
                    console.error('Failed to parse domande JSON string:', e);
                    domandeArray = [];
                }
            }
        } else if (Array.isArray(rawDomande)) {
            domandeArray = rawDomande;
        } else if (rawDomande && typeof rawDomande === 'object') {
            // Fallback: check if it's wrapped in an object like { domande: [...] }
            if (Array.isArray((rawDomande as any).domande)) {
                domandeArray = (rawDomande as any).domande;
            } else if (Array.isArray((rawDomande as any).questions)) {
                domandeArray = (rawDomande as any).questions;
            } else {
                console.error('domande is an object but does not contain an array property');
                domandeArray = [];
            }
        }

        console.log('Parsed domande array:', domandeArray);
        console.log('Number of questions:', domandeArray.length);

        const domande = domandeArray.map((d: any, idx: number) => ({
            id: String(d.id ?? d.key ?? d.slug ?? `q${idx + 1}`),
            testo: String(d.testo ?? d.text ?? d),
            tipo: (d.tipo ?? d.type ?? 'scala') as 'scala' | 'testo' | 'multipla',
            scalaMin: d.scalaMin ?? d.min ?? 0,
            scalaMax: d.scalaMax ?? d.max ?? (opzioniRisposta.length > 0 ? opzioniRisposta.length - 1 : 3),
            opzioni: d.opzioni ?? d.options ?? (opzioniRisposta.length > 0 ? opzioniRisposta : undefined),
        }));

        return {
            idQuestionario: isUuid ? idQuestionario : nomeTipologia, // Se non è salvato, l'ID è la tipologia
            nomeTipologia,
            tempoSomministrazione: Number(tipo[0].tempo),
            domande,
        };
    }

    /**
     * Calcola lo score del questionario in percentuale (base 100)
     * @param nomeTipologia - Nome della tipologia del questionario
     * @param risposte - Array di risposte { idDomanda: string, valore: number }
     * @returns Score in percentuale (0-100)
     */
    async calculateScore(nomeTipologia: string, risposte: Array<{ idDomanda: string; valore: number }>): Promise<number> {
        // Recupera la configurazione punteggio dalla tipologia
        const tipo = await db
            .select({
                punteggio: tipologiaQuestionario.punteggio,
                domande: tipologiaQuestionario.domande,
            })
            .from(tipologiaQuestionario)
            .where(eq(tipologiaQuestionario.nome, nomeTipologia))
            .limit(1);

        if (!tipo.length) {
            throw new Error('Tipologia questionario non trovata');
        }

        let rawPunteggio = tipo[0].punteggio;
        let punteggi: number[] = [];

        // Parse punteggio field (can be string with semicolons or array)
        if (typeof rawPunteggio === 'string' && rawPunteggio.includes(';')) {
            punteggi = rawPunteggio.split(';')
                .map(p => p.trim())
                .filter(p => p.length > 0)
                .map(p => parseFloat(p));
        } else if (Array.isArray(rawPunteggio)) {
            punteggi = rawPunteggio.map(p => typeof p === 'number' ? p : parseFloat(String(p)));
        } else if (typeof rawPunteggio === 'object' && rawPunteggio !== null) {
            // Could be wrapped in object
            const obj = rawPunteggio as any;
            if (Array.isArray(obj.punteggi)) {
                punteggi = obj.punteggi.map((p: any) => parseFloat(String(p)));
            }
        }

        // Calcola punteggio totale ottenuto
        let punteggioOttenuto = 0;
        for (const risposta of risposte) {
            const valore = risposta.valore;
            if (valore >= 0 && valore < punteggi.length) {
                punteggioOttenuto += punteggi[valore];
            }
        }

        // Calcola punteggio massimo possibile
        const numeroDomande = risposte.length;
        const punteggioMassimoPossibile = numeroDomande * Math.max(...punteggi);

        // Calcola percentuale (base 100)
        const scorePercentuale = punteggioMassimoPossibile > 0
            ? (punteggioOttenuto / punteggioMassimoPossibile) * 100
            : 0;

        return Math.round(scorePercentuale * 100) / 100; // Arrotonda a 2 decimali
    }

    /**
     * Salva il questionario compilato nel database
     * @param idPaziente - ID del paziente
     * @param nomeTipologia - Nome della tipologia del questionario
     * @param risposte - Array di risposte
     * @returns ID del questionario salvato e score calcolato
     */
    async submitQuestionario(
        idPaziente: string,
        nomeTipologia: string,
        risposte: Array<{ idDomanda: string; valore: number }>
    ): Promise<{ idQuestionario: string; score: number }> {
        // Calcola lo score
        const score = await this.calculateScore(nomeTipologia, risposte);

        // Prepara le risposte in formato JSON
        const risposteJson = risposte.reduce((acc, r) => {
            acc[r.idDomanda] = r.valore;
            return acc;
        }, {} as Record<string, number>);

        // Salva nel database
        const inserted = await db
            .insert(questionario)
            .values({
                idPaziente,
                nomeTipologia,
                score,
                risposte: risposteJson,
                cambiamento: false, // TODO: implementare logica di cambiamento se necessario
            })
            .returning({ id: questionario.idQuestionario });

        const id = inserted[0]?.id;
        if (!id) {
            throw new Error('Impossibile salvare il questionario');
        }

        // Aggiorna lo score del paziente (media di tutti i questionari)
        // e la priorità (se necessario)
        await this.scoreService.updatePatientScore(idPaziente, id);

        // Crea alert clinico se necessario (score >= 80, screening completo, max 1/mese)
        await this.alertService.createAlertIfNeeded(idPaziente, score);



        return { idQuestionario: id, score };
    }

    /**
     * Recupera le domande per la tipologia specificata senza creare un record su DB
     */
    async startCompilazione(idPaziente: string, nomeTipologia: string): Promise<any> {
        // Utilizziamo getQuestionarioDto passando il nome della tipologia come "ID"
        // Questo attiverà la logica "non-UUID" per recuperare le domande direttamente dalla tipologia
        return this.getQuestionarioDto(nomeTipologia);
    }
}
