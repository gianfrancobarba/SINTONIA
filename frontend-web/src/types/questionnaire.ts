/**
 * Type definitions for Questionnaires
 */

// Legacy status type - kept for backward compatibility
export type QuestionnaireStatus = 'Approvato' | 'In Revisione' | 'Rifiutato';

// New status type for management page
export type QuestionnaireManagementStatus = 'Compilato' | 'Revisionato' | 'Invalidato';

/**
 * Detailed questionnaire data from backend
 * Maps to backend QuestionnaireResponseDto
 */
export interface QuestionnaireData {
    idQuestionario: string;
    idPaziente: string;
    nomeTipologia: string;
    score: number | null;
    risposte: Record<string, number | string>; // JSON data: {"q1": 2, "q2": 3, ...}
    cambiamento: boolean;
    dataCompilazione: string;
    revisionato: boolean;
    invalidato: boolean;
    noteInvalidazione: string | null;
    dataInvalidazione: string | null;
    idPsicologoRevisione: string | null;
    idPsicologoRichiedente: string | null;
    idAmministratoreConferma: string | null;
    domande: string[]; // Array of questions from tipologia_questionario
    campi: string[]; // Array of answer options from tipologia_questionario
}

/**
 * Computed status based on flags
 */
export function getQuestionnaireStatus(q: QuestionnaireData): QuestionnaireManagementStatus {
    if (q.invalidato) return 'Invalidato';
    if (q.revisionato) return 'Revisionato';
    return 'Compilato';
}
