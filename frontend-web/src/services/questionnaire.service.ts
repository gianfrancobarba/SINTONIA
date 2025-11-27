import axios from 'axios';
import type { QuestionnaireData } from '../types/psychologist';
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
 */
export const fetchQuestionnairesByPatient = async (
    patientId: string
): Promise<QuestionnaireData[]> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const response = await axios.get(`${API_URL}/questionnaires/patient/${patientId}`,
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
 */
export const viewQuestionnaire = async (id: string): Promise<QuestionnaireData> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const response = await axios.get(`${API_URL}/questionnaires/${id}`,
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
    id: string,
    notes: string
): Promise<void> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        await axios.post(
            `${API_URL}/psi/questionnaires/${id}/review`,
            { notes },
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
        await axios.post(
            `${API_URL}/psi/questionnaires/${id}/request-invalidation`,
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
 * Mock data for development/testing
 */
// Rimosso l'uso dei dati mock per forzare l'uso del backend
