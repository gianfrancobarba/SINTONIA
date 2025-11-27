import type { Administrator, AdminInfo, Questionnaire } from '../types/adminDashboard.types';
import { getCurrentUser } from './auth.service';

const API_URL = 'http://localhost:3000';

/**
 * Fetch administrator information from backend API
 */
export const fetchAdministratorInfo = async (email: string): Promise<AdminInfo> => {
    const token = getCurrentUser()?.access_token as string | undefined;
    const url = `${API_URL}/dashboard?role=admin&email=${encodeURIComponent(email)}`;

    const response = await fetch(url, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new SyntaxError(`Unexpected content-type '${contentType}'. Response snippet: ${text.slice(0, 200)}`);
    }

    return await response.json();
};

/**
 * Get the current administrator information (mock data)
 */
export const getAdministratorInfo = (): Administrator => {
    return {
        name: 'Gianfranco',
        title: 'Amministratore',
        photo: undefined,
    };
};

/**
 * Get sample questionnaire data
 */
export const getQuestionnaires = (): Questionnaire[] => {
    return [
        {
            id: '1',
            name: 'K10',
            author: 'Gianfranco Barba',
            status: 'Approvato',
            revisionDate: '2023-10-26',
        },
        {
            id: '2',
            name: 'K10',
            author: 'Gianfranco Barba',
            status: 'Approvato',
            revisionDate: '2023-10-26',
        },
        {
            id: '3',
            name: 'K10',
            author: 'Gianfranco Barba',
            status: 'Approvato',
            revisionDate: '2023-10-26',
        },
    ];
};

/**
 * Get paginated questionnaires
 */
export const getQuestionnairesPage = (page: number, itemsPerPage: number = 3): Questionnaire[] => {
    const allQuestionnaires = getQuestionnaires();
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allQuestionnaires.slice(startIndex, endIndex);
};

/**
 * Get total number of pages
 */
export const getTotalPages = (itemsPerPage: number = 3): number => {
    const allQuestionnaires = getQuestionnaires();
    return Math.ceil(allQuestionnaires.length / itemsPerPage);
};
