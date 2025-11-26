/**
 * Service layer for psychologist data
 * Handles API calls to backend
 */

import type { Psychologist, Questionnaire, PsychologistDashboardData } from '../types/psychologist';
import { config } from '../config/config';

/**
 * Fetch dashboard data from backend API
 * @param codiceFiscale - Codice fiscale of the psychologist
 * @returns Dashboard data with profile info and notification counts
 * @throws Error if request fails
 */
export const fetchDashboardData = async (
    codiceFiscale: string = config.psychologistCF
): Promise<PsychologistDashboardData> => {
    try {
        const response = await fetch(
            `${config.apiBaseUrl}/psi/dashboard/me?cf=${encodeURIComponent(codiceFiscale)}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PsychologistDashboardData = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        throw error;
    }
};

/**
 * Get the current psychologist information (DEPRECATED - use fetchDashboardData)
 * @deprecated Use fetchDashboardData() instead for real data from backend
 */
export const getPsychologistInfo = (): Psychologist => {
    return {
        name: 'Dottor. Pirillo',
        title: 'Psicologo',
        photo: undefined,
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
