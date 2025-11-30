/**
 * Type definitions for the Psychologist Dashboard
 */

export interface Psychologist {
    name: string;
    title: string;
    photo?: string; // Optional - will be added by user in images folder
}

/**
 * Dashboard data from backend API
 * Matches the PsiDashboardResponseDto from backend
 */
export interface PsychologistDashboardData {
    fullName: string;
    profileImageUrl: string;
    role: string;
    alertsCount: number;
    pendingQuestionnairesCount: number;
    unreadMessagesCount: number;
}

/**
 * Psychologist data for admin management
 * Matches the database schema
 */
export interface PsychologistData {
    codiceFiscale: string;
    nome: string;
    cognome: string;
    aslAppartenenza: string;
    stato: 'Attivo' | 'Disattivato';
}

/**
 * Loading state for async operations
 */
export interface LoadingState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

// Legacy status type - kept for backward compatibility
export type QuestionnaireStatus = 'Approvato' | 'In Revisione' | 'Rifiutato';

// New status type for management page
export type QuestionnaireManagementStatus = 'Compilato' | 'Revisionato' | 'Invalidato';

export interface Questionnaire {
    id: string;
    name: string;
    author: string;
    status: QuestionnaireStatus;
    revisionDate: string; // Format: YYYY-MM-DD
}

/**
 * Detailed questionnaire data for management page
 * Maps to backend questionario table schema
 */
export interface QuestionnaireData {
    idQuestionario: string;
    idPaziente: string;
    nomeTipologia: string;
    score: number | null;
    risposte: any; // JSON data
    cambiamento: boolean;
    dataCompilazione: string;
    revisionato: boolean;
    invalidato: boolean;
    noteInvalidazione: string | null;
    dataInvalidazione: string | null;
    idPsicologoRevisione: string | null;
    idPsicologoRichiedente: string | null;
    idAmministratoreConferma: string | null;
}

/**
 * Computed status based on flags
 */
export function getQuestionnaireStatus(q: QuestionnaireData): QuestionnaireManagementStatus {
    if (q.invalidato) return 'Invalidato';
    if (q.revisionato) return 'Revisionato';
    return 'Compilato';
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
}
