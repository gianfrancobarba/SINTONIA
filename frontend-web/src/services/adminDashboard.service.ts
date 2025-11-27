import type { Administrator, AdminInfo, Questionnaire } from '../types/adminDashboard.types';

/**
 * Fetch administrator information from backend API
 */
export const fetchAdministratorInfo = async (email: string): Promise<AdminInfo> => {
    const response = await fetch(`/api/dashboard?role=admin&email=${encodeURIComponent(email)}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
