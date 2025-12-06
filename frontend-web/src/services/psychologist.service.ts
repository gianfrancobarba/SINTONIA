/**
 * Service layer for psychologist data
 * Handles API calls to backend
 */

import type { Psychologist, QuestionnaireData, PsychologistDashboardData } from '../types/psychologist';
import { getCurrentUser } from './auth.service';

const API_URL = 'http://localhost:3000';

/**
 * Fetch dashboard data from backend API
 * @param codiceFiscale - Codice fiscale of the psychologist
 * @returns Dashboard data with profile info and notification counts
 * @throws Error if request fails
 */
export const fetchDashboardData = async (
    codiceFiscale: string
): Promise<PsychologistDashboardData> => {
    try {
        const url = `${API_URL}/psi/dashboard/me?cf=${encodeURIComponent(codiceFiscale)}`;
        const token = getCurrentUser()?.access_token as string | undefined;

        const response = await fetch(url, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });

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
export const getQuestionnaires = (): QuestionnaireData[] => {
    return [
        {
            idQuestionario: '1',
            idPaziente: 'paziente-1',
            nomeTipologia: 'K10',
            score: 25,
            risposte: {},
            cambiamento: false,
            dataCompilazione: '2023-10-26',
            revisionato: true,
            invalidato: false,
            noteInvalidazione: null,
            dataInvalidazione: null,
            idPsicologoRevisione: 'psi-1',
            idPsicologoRichiedente: null,
            idAmministratoreConferma: null,
            domande: [],
            campi: []
        },
        {
            idQuestionario: '2',
            idPaziente: 'paziente-2',
            nomeTipologia: 'K10',
            score: 18,
            risposte: {},
            cambiamento: false,
            dataCompilazione: '2023-10-26',
            revisionato: true,
            invalidato: false,
            noteInvalidazione: null,
            dataInvalidazione: null,
            idPsicologoRevisione: 'psi-1',
            idPsicologoRichiedente: null,
            idAmministratoreConferma: null,
            domande: [],
            campi: []
        },
        {
            idQuestionario: '3',
            idPaziente: 'paziente-3',
            nomeTipologia: 'K10',
            score: 32,
            risposte: {},
            cambiamento: true,
            dataCompilazione: '2023-10-26',
            revisionato: true,
            invalidato: false,
            noteInvalidazione: null,
            dataInvalidazione: null,
            idPsicologoRevisione: 'psi-1',
            idPsicologoRichiedente: null,
            idAmministratoreConferma: null,
            domande: [],
            campi: []
        },
    ];
};

/**
 * Get paginated questionnaires
 */
export const getQuestionnairesPage = (page: number, itemsPerPage: number = 3): QuestionnaireData[] => {
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

/**
 * Psychologist option for dropdown
 */
export interface PsychologistOption {
    codFiscale: string;
    nome: string;
    cognome: string;
    email?: string;
    aslAppartenenza?: string;
    stato?: boolean | 'attivo' | 'sospeso';
    immagineProfilo?: string | null;
}

/**
 * Fetch all psychologists (admin only)
 * Used for dropdown selection when assigning psychologists to patients
 */
export const fetchAllPsychologists = async (): Promise<PsychologistOption[]> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const response = await fetch(`${API_URL}/admin/psychologists`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PsychologistOption[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching psychologists:', error);
        throw error;
    }
};

/**
 * Create a new psychologist (admin only)
 * @param psychologistData - Psychologist data to create
 */
export const createPsychologist = async (psychologistData: {
    codFiscale: string;
    nome: string;
    cognome: string;
    email: string;
    aslAppartenenza: string;
}): Promise<any> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const response = await fetch(`${API_URL}/admin/psychologists`, {
            method: 'POST',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(psychologistData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating psychologist:', error);
        throw error;
    }
};

/**
 * Update an existing psychologist (admin only)
 * @param codiceFiscale - Codice fiscale of the psychologist to update
 * @param updateData - Data to update (email and/or aslAppartenenza)
 */
export const updatePsychologist = async (
    codiceFiscale: string,
    updateData: {
        email?: string;
        aslAppartenenza?: string;
    }
): Promise<any> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const response = await fetch(`${API_URL}/admin/psychologists/${encodeURIComponent(codiceFiscale)}`, {
            method: 'PATCH',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating psychologist:', error);
        throw error;
    }
};

/**
 * Fetch psychologist profile
 */
export const getProfile = async (codiceFiscale: string): Promise<any> => {
    try {
        const url = `${API_URL}/psi/area-personale/me?cf=${encodeURIComponent(codiceFiscale)}`;
        const token = getCurrentUser()?.access_token as string | undefined;

        const response = await fetch(url, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch profile:', error);
        throw error;
    }
};

/**
 * Update psychologist profile
 */
export const updateProfile = async (codiceFiscale: string, data: { email: string; immagineProfilo?: File | null }): Promise<any> => {
    try {
        const url = `${API_URL}/psi/area-personale/me?cf=${encodeURIComponent(codiceFiscale)}`;
        const token = getCurrentUser()?.access_token as string | undefined;

        const formData = new FormData();
        formData.append('email', data.email);
        if (data.immagineProfilo) {
            formData.append('immagineProfilo', data.immagineProfilo);
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                // Content-Type is automatically set with boundary for FormData
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to update profile:', error);
        throw error;
    }
};

/**
 * Delete a psychologist (soft delete)
 * @param codiceFiscale - Codice fiscale of the psychologist to delete
 */
export const deletePsychologist = async (codiceFiscale: string): Promise<any> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const response = await fetch(`${API_URL}/admin/psychologists/${encodeURIComponent(codiceFiscale)}`, {
            method: 'DELETE',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Extract error message from response body
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (jsonError) {
                // If response is not JSON, use default error message
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting psychologist:', error);
        throw error;
    }
};

/**
 * Submit a technical support request
 * @param data - Support request data (subject and description)
 */
export const submitSupportRequest = async (data: { oggetto: string; descrizione: string }): Promise<any> => {
    try {
        const url = `${API_URL}/psi/support-request`;
        const token = getCurrentUser()?.access_token as string | undefined;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to submit support request:', error);
        throw error;
    }
};

