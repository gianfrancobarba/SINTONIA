import type { StoricoQuestionariDto } from '../types/questionari';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Fetch patient questionnaire history (pending and completed)
 */
export const getStoricoQuestionari = async (page: number = 1, limit: number = 10): Promise<StoricoQuestionariDto> => {
    try {
        const token = localStorage.getItem('patient_token');
        if (!token) {
            window.location.href = '/spid-info';
            throw new Error('Missing auth token. Redirecting to login...');
        }

        const response = await fetch(`${API_BASE_URL}/paziente/questionari?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('patient_token');
            window.location.href = '/spid-info';
            throw new Error('Unauthorized. Redirecting to login...');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching storico questionari:', error);
        throw error;
    }
};

/**
 * Check if patient has completed all 4 initial questionnaires
 * Returns hasCompleted and the list of pending questionnaires
 */
export const checkInitialQuestionnaires = async (): Promise<{
    hasCompleted: boolean;
    pendingQuestionnaires: string[];
}> => {
    try {
        const token = localStorage.getItem('patient_token');
        if (!token) {
            return { hasCompleted: true, pendingQuestionnaires: [] }; // Don't show modal if not authenticated
        }

        const response = await fetch(`${API_BASE_URL}/paziente/questionari/initial-check`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Error checking initial questionnaires:', response.status);
            return { hasCompleted: true, pendingQuestionnaires: [] }; // Don't show modal on error
        }

        const data = await response.json();
        return {
            hasCompleted: data.hasCompleted,
            pendingQuestionnaires: data.pendingQuestionnaires || []
        };
    } catch (error) {
        console.error('Error checking initial questionnaires:', error);
        return { hasCompleted: true, pendingQuestionnaires: [] }; // Don't show modal on error
    }
};
