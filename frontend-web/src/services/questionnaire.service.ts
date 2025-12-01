import axios from 'axios';
import type { QuestionnaireData } from '../types/questionnaire';
import { getCurrentUser } from './auth.service';

const API_URL = 'http://localhost:3000';

/**
 * Fetch questionnaires based on user role
 * @param role - 'psychologist' or 'admin'
 * @param cf - Codice fiscale (required for psychologist)
 */
export const fetchQuestionnaires = async (
    role: 'psychologist' | 'admin',
    cf?: string
): Promise<QuestionnaireData[]> => {
    try {
        let endpoint = '';
        if (role === 'psychologist') {
            if (!cf) {
                throw new Error('Codice fiscale (cf) richiesto per ruolo psychologist');
            }
            endpoint = `/psi/questionnaires?cf=${cf}`;
        } else {
            endpoint = '/admin/questionnaires';
        }

        const token = getCurrentUser()?.access_token as string | undefined;
        const response = await axios.get(`${API_URL}${endpoint}`,
            {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'Content-Type': 'application/json',
                },
            },
        );
        return response.data;
    } catch (error) {
        console.warn('Errore nel recupero questionari dal backend:', error);
        throw error;
    }
};

/**
 * Fetch questionnaires filtered by patient ID
 * @param role - 'psychologist' or 'admin'
 * @param patientId - ID of the patient
 */
export const fetchQuestionnairesByPatient = async (
    role: 'psychologist' | 'admin',
    patientId: string
): Promise<QuestionnaireData[]> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;

        // Different endpoints for psychologist and admin
        const endpoint = role === 'admin'
            ? `/admin/questionnaires/patient/${patientId}`
            : `/psi/questionnaires/patient/${patientId}`;

        const response = await axios.get(`${API_URL}${endpoint}`,
            {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'Content-Type': 'application/json',
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching questionnaires by patient:', error);
        throw error;
    }
};

/**
 * Fetch single questionnaire details
 * Uses role-specific endpoints: /psi/questionnaires/:id or /admin/questionnaires/:id
 */
export const viewQuestionnaire = async (id: string, role: 'psychologist' | 'admin'): Promise<QuestionnaireData> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;

        // Use role-specific endpoint
        const endpoint = role === 'admin'
            ? `/admin/questionnaires/${id}`
            : `/psi/questionnaires/${id}`;

        const response = await axios.get(`${API_URL}${endpoint}`,
            {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'Content-Type': 'application/json',
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error viewing questionnaire:', error);
        throw error;
    }
};

/**
 * Review a questionnaire (psychologist only)
 */
export const reviewQuestionnaire = async (
    id: string
): Promise<void> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const cf = getCurrentUser()?.fiscalCode || getCurrentUser()?.email;

        await axios.post(
            `${API_URL}/psi/questionnaires/${id}/review?cf=${cf}`,
            {},
            {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'Content-Type': 'application/json',
                },
            },
        );
    } catch (error) {
        console.error('Error reviewing questionnaire:', error);
        throw error;
    }
};

/**
 * Request invalidation of a questionnaire (psychologist only)
 */
export const requestInvalidation = async (
    id: string,
    notes: string
): Promise<void> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const cf = getCurrentUser()?.fiscalCode || getCurrentUser()?.email;

        await axios.post(
            `${API_URL}/psi/questionnaires/${id}/request-invalidation?cf=${cf}`,
            { notes },
            {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'Content-Type': 'application/json',
                },
            },
        );
    } catch (error) {
        console.error('Error requesting invalidation:', error);
        throw error;
    }
};

/**
 * Upload new questionnaire type (admin only)
 */
export const uploadQuestionnaireType = async (data: any): Promise<void> => {
    try {
        await axios.post(`${API_URL}/admin/questionnaire-types`, data);
    } catch (error) {
        console.error('Error uploading questionnaire type:', error);
        throw error;
    }
};
/**
 * Cancel a revision (admin only)
 * Note: Backend endpoint might not exist yet.
 */
export const cancelRevision = async (id: string): Promise<void> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        // Placeholder endpoint - this will likely fail until backend is implemented
        await axios.post(
            `${API_URL}/admin/questionnaires/${id}/cancel-revision`,
            {},
            {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'Content-Type': 'application/json',
                },
            },
        );
    } catch (error) {
        console.error('Error cancelling revision:', error);
        throw error;
    }
};
