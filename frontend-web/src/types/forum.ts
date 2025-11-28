/**
 * Type definitions for Forum functionality
 * Matches backend database schema (domanda_forum, risposta_forum)
 */

export type ForumCategory = 'Ansia' | 'Stress' | 'Tristezza' | 'Vita di coppia' | 'Altro';

/**
 * Forum question from database
 * Maps to domanda_forum table
 */
export interface ForumQuestion {
    idDomanda: string;              // UUID from DB
    idPaziente: string;             // UUID from DB (not displayed, always "Anonimo")
    categoria: ForumCategory;       // categoria from DB
    titolo: string;                 // titolo from DB (displayed in card header)
    testo: string;                  // testo from DB (question body)
    dataInserimento: string;        // ISO 8601 timestamp
    hasAnswer: boolean;             // Computed: check if risposta exists
    risposta?: ForumAnswer;         // Join with risposta_forum
}

/**
 * Forum answer from database
 * Maps to risposta_forum table
 */
export interface ForumAnswer {
    idRisposta: string;             // UUID from DB
    idDomanda: string;              // UUID from DB
    idPsicologo: string;            // cod_fiscale from DB
    psychologistName: string;       // Computed from psicologo table
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
