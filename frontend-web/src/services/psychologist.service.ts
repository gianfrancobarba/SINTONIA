/**
 * Service layer for psychologist data
 * Currently returns mock data matching the mockup
 */

import type { Psychologist, Questionnaire } from '../types/psychologist';

/**
 * Get the current psychologist information
 */
export const getPsychologistInfo = (): Psychologist => {
    return {
        name: 'Dottor. Pirillo',
        title: 'Psicologo',
        photo: undefined, // User will add photo to images folder
    };
};

/**
 * Get sample questionnaire data
 * Returns mock data matching the mockup (K10 questionnaires by Gianfranco Barba)
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
