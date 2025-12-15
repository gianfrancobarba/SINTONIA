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

// Re-export questionnaire types for backward compatibility
export type {
    QuestionnaireData,
    QuestionnaireStatus,
    QuestionnaireManagementStatus,
} from './questionnaire';
export { getQuestionnaireStatus } from './questionnaire';


export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
}
