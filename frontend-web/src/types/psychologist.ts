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
 * Loading state for async operations
 */
export interface LoadingState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export type QuestionnaireStatus = 'Approvato' | 'In Revisione' | 'Rifiutato';

export interface Questionnaire {
    id: string;
    name: string;
    author: string;
    status: QuestionnaireStatus;
    revisionDate: string; // Format: YYYY-MM-DD
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
}
