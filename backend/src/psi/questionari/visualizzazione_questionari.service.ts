import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, isNull, isNotNull, or } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { paziente, questionario } from '../../drizzle/schema.js';

@Injectable()
export class Visualizzazione_questionariService {
  /**
   * Restituisce tutti i questionari NON revisionati dei pazienti assegnati
   * allo psicologo indicato (opzionalmente esclude anche i questionari invalidati)
   * Applica la logica di visibilità per le richieste di invalidazione
   */
  async getNonRevisionatiByPsicologo(cf: string, excludeInvalidati = true) {
    // Verifica presenza del CF nello schema paziente -> evita CF non esistenti
    const assignedPatients = await db
      .select({ idPaziente: paziente.idPaziente })
      .from(paziente)
      .where(eq(paziente.idPsicologo, cf));

    if (assignedPatients.length === 0) {
      // Nessun paziente assegnato o CF non valido
      return [];
    }

    const conditions = [
      eq(paziente.idPsicologo, cf),
      eq(questionario.revisionato, false),
      // Mostra se: NON c'è richiesta OPPURE l'admin ha già risposto
      or(
        // CASO 1: Nessuna richiesta di invalidazione (idPsicologoRichiedente è NULL)
        isNull(questionario.idPsicologoRichiedente),
        // CASO 2: Admin ha già risposto (idAmministratoreConferma NOT NULL)
        // Questo include sia richieste approvate che rifiutate
        isNotNull(questionario.idAmministratoreConferma)
      )
    ];

    if (excludeInvalidati) {
      conditions.push(eq(questionario.invalidato, false));
    }

    const rows = await db
      .select({
        idQuestionario: questionario.idQuestionario,
        idPaziente: questionario.idPaziente,
        nomeTipologia: questionario.nomeTipologia,
        score: questionario.score,
        risposte: questionario.risposte,
        cambiamento: questionario.cambiamento,
        dataCompilazione: questionario.dataCompilazione,
        revisionato: questionario.revisionato,
        invalidato: questionario.invalidato,
        noteInvalidazione: questionario.noteInvalidazione,
        dataInvalidazione: questionario.dataInvalidazione,
        idPsicologoRevisione: questionario.idPsicologoRevisione,
        idPsicologoRichiedente: questionario.idPsicologoRichiedente,
        idAmministratoreConferma: questionario.idAmministratoreConferma,
      })
      .from(questionario)
      .innerJoin(paziente, eq(questionario.idPaziente, paziente.idPaziente))
      .where(and(...conditions));

    return rows;
  }

  /**
   * Restituisce TUTTI i questionari non invalidati E non revisionati
   * (indipendentemente dall' assegnazione del paziente allo psicologo)
   * LOGICA DI VISIBILITÀ:
   * - NON mostrare se invalidato = true
   * - NON mostrare se esiste richiesta di invalidazione in attesa
   *   ECCETTO se la richiesta è stata rifiutata dall'admin
   */
  async getTuttiNonInvalidati() {
    const rows = await db
      .select({
        idQuestionario: questionario.idQuestionario,
        idPaziente: questionario.idPaziente,
        nomeTipologia: questionario.nomeTipologia,
        score: questionario.score,
        risposte: questionario.risposte,
        cambiamento: questionario.cambiamento,
        dataCompilazione: questionario.dataCompilazione,
        revisionato: questionario.revisionato,
        invalidato: questionario.invalidato,
        noteInvalidazione: questionario.noteInvalidazione,
        dataInvalidazione: questionario.dataInvalidazione,
        idPsicologoRevisione: questionario.idPsicologoRevisione,
        idPsicologoRichiedente: questionario.idPsicologoRichiedente,
        idAmministratoreConferma: questionario.idAmministratoreConferma,
      })
      .from(questionario)
      .where(and(
        eq(questionario.invalidato, false),
        eq(questionario.revisionato, false),
        // Mostra se: NON c'è richiesta OPPURE l'admin ha già risposto
        or(
          // CASO 1: Nessuna richiesta di invalidazione
          isNull(questionario.idPsicologoRichiedente),
          // CASO 2: Admin ha già risposto
          isNotNull(questionario.idAmministratoreConferma)
        )
      ));

    return rows;
  }


  /**
   * Restituisce TUTTI i questionari non invalidati di uno specifico paziente
   * (indipendentemente dall' assegnazione del paziente allo psicologo)
   * LOGICA DI VISIBILITÀ:
   * - NON mostrare se invalidato = true
   * - NON mostrare se esiste richiesta di invalidazione in attesa
   *   ECCETTO se la richiesta è stata rifiutata dall'admin
   */
  async getQuestionariByPaziente(idPaziente: string) {
    const rows = await db
      .select({
        idQuestionario: questionario.idQuestionario,
        idPaziente: questionario.idPaziente,
        nomeTipologia: questionario.nomeTipologia,
        score: questionario.score,
        risposte: questionario.risposte,
        cambiamento: questionario.cambiamento,
        dataCompilazione: questionario.dataCompilazione,
        revisionato: questionario.revisionato,
        invalidato: questionario.invalidato,
        noteInvalidazione: questionario.noteInvalidazione,
        dataInvalidazione: questionario.dataInvalidazione,
        idPsicologoRevisione: questionario.idPsicologoRevisione,
        idPsicologoRichiedente: questionario.idPsicologoRichiedente,
        idAmministratoreConferma: questionario.idAmministratoreConferma,
      })
      .from(questionario)
      .where(and(
        eq(questionario.idPaziente, idPaziente),
        eq(questionario.invalidato, false),
        // Mostra se: NON c'è richiesta OPPURE l'admin ha già risposto
        or(
          // CASO 1: Nessuna richiesta di invalidazione
          isNull(questionario.idPsicologoRichiedente),
          // CASO 2: Admin ha già risposto
          isNotNull(questionario.idAmministratoreConferma)
        )
      ));

    return rows;
  }
}
