import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { db } from '../../../drizzle/db.js';
import { questionario, tipologiaQuestionario, paziente } from '../../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { ScoreService } from '../../score/score.service.js';
import { AlertService } from '../../alert/alert.service.js';
import { BadgeService } from '../../badge/badge.service.js';

@Injectable()
export class Compilazione_questionarioService {
    constructor(
        private readonly scoreService: ScoreService,
        private readonly alertService: AlertService,
        private readonly badgeService: BadgeService
    ) { }
    // --- VALIDAZIONI ---

    async validazioneRecupero(idQuestionario: string): Promise<boolean> {
        if (!idQuestionario || idQuestionario.trim() === '') {
            throw new BadRequestException('ID Questionario o Nome Tipologia obbligatorio');
        }

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idQuestionario);
        if (!isUuid) {
            // Se non è UUID, è un nome tipologia -> Verifichiamo esistenza
            const tipo = await db
                .select({ nome: tipologiaQuestionario.nome })
                .from(tipologiaQuestionario)
                .where(eq(tipologiaQuestionario.nome, idQuestionario))
                .limit(1);

            if (!tipo.length) {
                throw new NotFoundException('Tipologia questionario non trovata');
            }
        }

        return true;
    }

    async validazioneCalcoloScore(nomeTipologia: string, risposte: Array<{ idDomanda: string; valore: number }>): Promise<boolean> {
        if (!nomeTipologia) {
            throw new BadRequestException('Nome tipologia obbligatorio');
        }

        // Verifica esistenza tipologia
        const tipo = await db
            .select({ nome: tipologiaQuestionario.nome })
            .from(tipologiaQuestionario)
            .where(eq(tipologiaQuestionario.nome, nomeTipologia))
            .limit(1);

        if (!tipo.length) {
            throw new NotFoundException('Tipologia questionario non trovata');
        }

        if (!risposte || !Array.isArray(risposte)) {
            throw new BadRequestException('Le risposte devono essere un array valido');
        }

        return true;
    }

    async validazioneInvio(idPaziente: string, nomeTipologia: string, risposte: Array<{ idDomanda: string; valore: number }>): Promise<boolean> {
        if (!idPaziente) {
            throw new BadRequestException('ID Paziente obbligatorio');
        }

        const paz = await db.select().from(paziente).where(eq(paziente.idPaziente, idPaziente)).limit(1);
        if (!paz.length) {
            throw new NotFoundException('Paziente non trovato');
        }

        // Controllo tipologia e risposte delegando o rifacendo (meglio rifare per isolamento unit)
        if (!nomeTipologia) {
            throw new BadRequestException('Nome tipologia obbligatorio');
        }

        if (!risposte || !Array.isArray(risposte) || risposte.length === 0) {
            throw new BadRequestException('È necessario fornire almeno una risposta');
        }

        return true;
    }

    // --- METODI PRINCIPALI ---

    // Metodo per ottenere un questionario specifico con le sue domande dalla tipologia_questionario
    async getQuestionarioDto(idQuestionario: string): Promise<{
        idQuestionario: string;
        nomeTipologia: string;
        tempoSomministrazione: number;
        domande: Array<{ id: string; testo: string; tipo: 'scala' | 'testo' | 'multipla'; scalaMin?: number; scalaMax?: number; opzioni?: string[] }>;
    }> {
        await this.validazioneRecupero(idQuestionario);

        console.log(`getQuestionarioDto called with id: ${idQuestionario}`);
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idQuestionario);
        let nomeTipologia = '';

        if (isUuid) {
            // ... (logica esistente)
            const qs = await db
                .select({ id: questionario.idQuestionario, nomeTipologia: questionario.nomeTipologia })
                .from(questionario)
                .where(eq(questionario.idQuestionario, idQuestionario))
                .limit(1);

            if (!qs.length) {
                // throw new Error('Questionario non trovato'); 
                // Manteniamo coerenza con category partition che prevede errore
                throw new Error('Questionario non trovato');
            }
            nomeTipologia = qs[0].nomeTipologia as string;
        } else {
            nomeTipologia = idQuestionario;
        }

        // prendi la tipologia
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
            throw new Error('Tipologia non trovata');
        }

        // ... (logica parsing esistente, abbreviata per brevità del tool ma deve essere mantenuta)
        // PER EVITARE DI CANCELLARE LOGICA COMPLESSA, COPIO TUTTO IL RESTO UGUALE

        let rawDomande = tipo[0].domande;
        let rawCampi = tipo[0].campi;
        let opzioniRisposta: string[] = [];

        if (typeof rawCampi === 'string' && rawCampi.includes(';')) {
            opzioniRisposta = rawCampi.split(';').map(r => r.trim()).filter(r => r.length > 0);
        } else if (Array.isArray(rawCampi)) {
            opzioniRisposta = rawCampi.map(r => String(r));
        }

        let domandeArray: any[] = [];
        // Parsing logica complessa... (riporto la logica originale semplificata per non esplodere i token, ma attenzione: il replace deve essere preciso)
        // Purtroppo 'replace_file_content' richiede il contenuto esatto per essere safe.
        // Userò l'approccio di mantenere il codice originale dove possibile.

        // ... (codice parsing originale) ...
        if (typeof rawDomande === 'string') {
            if (rawDomande.includes(';')) {
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
                try {
                    rawDomande = JSON.parse(rawDomande);
                    if (Array.isArray(rawDomande)) domandeArray = rawDomande;
                } catch (e) { domandeArray = []; }
            }
        } else if (Array.isArray(rawDomande)) {
            domandeArray = rawDomande;
        } else if (rawDomande && typeof rawDomande === 'object') {
            if (Array.isArray((rawDomande as any).domande)) domandeArray = (rawDomande as any).domande;
            else if (Array.isArray((rawDomande as any).questions)) domandeArray = (rawDomande as any).questions;
            else domandeArray = [];
        }

        const domande = domandeArray.map((d: any, idx: number) => ({
            id: String(d.id ?? d.key ?? d.slug ?? `q${idx + 1}`),
            testo: String(d.testo ?? d.text ?? d),
            tipo: (d.tipo ?? d.type ?? 'scala') as 'scala' | 'testo' | 'multipla',
            scalaMin: d.scalaMin ?? d.min ?? 0,
            scalaMax: d.scalaMax ?? d.max ?? (opzioniRisposta.length > 0 ? opzioniRisposta.length - 1 : 3),
            opzioni: d.opzioni ?? d.options ?? (opzioniRisposta.length > 0 ? opzioniRisposta : undefined),
        }));

        return {
            idQuestionario: isUuid ? idQuestionario : nomeTipologia,
            nomeTipologia,
            tempoSomministrazione: Number(tipo[0].tempo),
            domande,
        };
    }

    /**
     * Calcola lo score del questionario in percentuale (base 100)
     */
    async calculateScore(nomeTipologia: string, risposte: Array<{ idDomanda: string; valore: number }>): Promise<number> {
        await this.validazioneCalcoloScore(nomeTipologia, risposte);

        const tipo = await db
            .select({
                punteggio: tipologiaQuestionario.punteggio,
            })
            .from(tipologiaQuestionario)
            .where(eq(tipologiaQuestionario.nome, nomeTipologia))
            .limit(1);

        // La validazione ha già controllato l'esistenza, ma qui serve i dati
        // Nota: validazioneCalcoloScore fa una query ma non ritorna i dati per separation of concerns (o potremmo farcelo ritornare per efficienza, ma seguiamo pattern "validazione pura")
        if (!tipo.length) throw new Error('Tipologia questionario non trovata');

        let rawPunteggio = tipo[0].punteggio;
        let punteggi: number[] = [];

        if (typeof rawPunteggio === 'string' && rawPunteggio.includes(';')) {
            punteggi = rawPunteggio.split(';').map(p => p.trim()).filter(p => p.length > 0).map(p => parseFloat(p));
        } else if (Array.isArray(rawPunteggio)) {
            punteggi = rawPunteggio.map(p => typeof p === 'number' ? p : parseFloat(String(p)));
        } else if (typeof rawPunteggio === 'object' && rawPunteggio !== null) {
            const obj = rawPunteggio as any;
            if (Array.isArray(obj.punteggi)) {
                punteggi = obj.punteggi.map((p: any) => parseFloat(String(p)));
            }
        }

        let punteggioOttenuto = 0;
        for (const risposta of risposte) {
            const valore = risposta.valore;
            if (valore >= 0 && valore < punteggi.length) {
                punteggioOttenuto += punteggi[valore];
            }
        }

        const numeroDomande = risposte.length;
        const punteggioMassimoPossibile = numeroDomande * Math.max(...punteggi);

        const scorePercentuale = punteggioMassimoPossibile > 0
            ? (punteggioOttenuto / punteggioMassimoPossibile) * 100
            : 0;

        return Math.round(scorePercentuale * 100) / 100;
    }

    /**
     * Salva il questionario compilato nel database
     */
    async submitQuestionario(
        idPaziente: string,
        nomeTipologia: string,
        risposte: Array<{ idDomanda: string; valore: number }>
    ): Promise<{ idQuestionario: string; score: number }> {
        // Validazione Input
        await this.validazioneInvio(idPaziente, nomeTipologia, risposte);

        // Verifica esistenza Paziente (parte di Exec o Validation? Solitamente Validation, aggiungiamolo a validazioneInvio nel prossimo step per non rompere questo edit gigante)
        // Anzi, aggiungiamolo nella logica di validazioneInvio sopra se ho l'import.

        // Calcola lo score (che a sua volta valida la tipologia)
        const score = await this.calculateScore(nomeTipologia, risposte);

        const risposteJson = risposte.reduce((acc, r) => {
            acc[r.idDomanda] = r.valore;
            return acc;
        }, {} as Record<string, number>);

        const inserted = await db
            .insert(questionario)
            .values({
                idPaziente,
                nomeTipologia,
                score,
                risposte: risposteJson,
                cambiamento: false,
            })
            .returning({ id: questionario.idQuestionario });

        const id = inserted[0]?.id;
        if (!id) {
            throw new Error('Impossibile salvare il questionario');
        }

        await this.scoreService.updatePatientScore(idPaziente, id);
        await this.alertService.createAlertIfNeeded(idPaziente, score);
        await this.badgeService.checkAndAwardBadges(idPaziente);

        return { idQuestionario: id, score };
    }

    async startCompilazione(idPaziente: string, nomeTipologia: string): Promise<any> {
        return this.getQuestionarioDto(nomeTipologia);
    }
}
