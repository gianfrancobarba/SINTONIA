/**
 * Type definitions for Forum functionality
 * Matches backend database schema (domanda_forum, risposta_forum)
 */

export type ForumCategory = 'Ansia' | 'Stress' | 'Tristezza' | 'Vita di Coppia';

/**
 * Forum question from database
 * Matches backend ForumQuestionDto
 */
export interface ForumQuestion {
    idDomanda: string;              // UUID from DB
    idPaziente?: string;            // UUID from DB (optional, not in backend DTO)
    categoria: ForumCategory;       // categoria from DB
    titolo: string;                 // titolo from DB (displayed in card header)
    testo: string;                  // testo from DB (question body)
    dataInserimento: string;        // ISO 8601 timestamp
    hasResponse?: boolean;          // Backend flag: check if risposta exists
    risposte?: ForumAnswer[];       // Array of answers from multiple psychologists
}

/**
 * Forum answer from database
 * Matches backend ForumAnswerDto
 */
export interface ForumAnswer {
    idRisposta: string;             // UUID from DB
    idDomanda?: string;             // UUID from DB (optional)
    idPsicologo: string;            // cod_fiscale from DB
    nomePsicologo: string;          // Nome from psicologo table
    cognomePsicologo: string;       // Cognome from psicologo table
    immagineProfilo?: string | null; // Immagine profilo from psicologo table
    testo: string;                  // testo from DB (answer text)
    dataRisposta: string;           // ISO 8601 timestamp
}

/**
 * Forum statistics
 */
export interface ForumStats {
    totalQuestions: number;         // Count all questions for psi's patients
    unansweredQuestions: number;    // Questions without risposta
    answeredQuestions: number;      // Questions with risposta
}

/**
 * Loading state for async operations
 */
export interface LoadingState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}
