import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { paziente, questionario } from '../../drizzle/schema.js';

@Injectable()
export class Visualizzazione_questionariService {
  /**
   * Restituisce tutti i questionari NON revisionati dei pazienti assegnati
   * allo psicologo indicato (opzionalmente esclude anche i questionari invalidati)
   * Esclude anche i questionari per cui è stata richiesta un'invalidazione
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
      isNull(questionario.idPsicologoRichiedente), // Esclude questionari con richiesta di invalidazione
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
   * Esclude anche i questionari per cui è stata richiesta un'invalidazione
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
        isNull(questionario.idPsicologoRichiedente), // Esclude questionari con richiesta di invalidazione
      ));

    return rows;
  }


  /**
   * Restituisce TUTTI i questionari non invalidati di uno specifico paziente, indipendentemente dall' assegnazione del paziente allo psicologo
   * (Questa ci serve per visualizzare i questionari di un paziente in particolare, requisito UG2)
   * Esclude anche i questionari per cui è stata richiesta un'invalidazione
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
        isNull(questionario.idPsicologoRichiedente), // Esclude questionari con richiesta di invalidazione
      ));

    return rows;
  }
}

