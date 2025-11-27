/**
 * Service layer for administrator data
 * Currently returns mock data
 */

import type { Administrator, Questionnaire } from '../types/adminDashboard.types';

/**
 * Get the current administrator information
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
