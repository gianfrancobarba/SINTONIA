import axios from 'axios';
import type { QuestionnaireData } from '../types/psychologist';

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
                console.warn('No codice fiscale provided, using mock data');
                return getMockQuestionnaires(role);
            }
            endpoint = `/psi/questionnaires?cf=${cf}`;
        } else {
            endpoint = '/admin/questionnaires';
        }

        const response = await axios.get(`${API_URL}${endpoint}`);
        return response.data;
    } catch (error) {
        console.warn('Backend not available, using mock data:', error);
        // Always return mock data as fallback
        return getMockQuestionnaires(role);
    }
};

/**
 * Fetch questionnaires filtered by patient ID
 */
export const fetchQuestionnairesByPatient = async (
    patientId: string
): Promise<QuestionnaireData[]> => {
    try {
        const response = await axios.get(`${API_URL}/questionnaires/patient/${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching questionnaires by patient:', error);
        // Return mock filtered data
        return getMockQuestionnaires('psychologist').filter(
            q => q.idPaziente === patientId
        );
    }
};

/**
 * Fetch single questionnaire details
 */
export const viewQuestionnaire = async (id: string): Promise<QuestionnaireData> => {
    try {
        const response = await axios.get(`${API_URL}/questionnaires/${id}`);
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
        await axios.post(`${API_URL}/psi/questionnaires/${id}/review`, { notes });
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
        await axios.post(`${API_URL}/psi/questionnaires/${id}/request-invalidation`, { notes });
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
function getMockQuestionnaires(role: 'psychologist' | 'admin'): QuestionnaireData[] {
    const mockData: QuestionnaireData[] = [
        {
            idQuestionario: 'q-1',
            idPaziente: 'p-001',
            nomeTipologia: 'PHQ-9',
            score: 12,
            risposte: {},
            cambiamento: false,
            dataCompilazione: '2023-10-26',
            revisionato: false,
            invalidato: false,
            noteInvalidazione: null,
            dataInvalidazione: null,
            idPsicologoRevisione: null,
            idPsicologoRichiedente: null,
            idAmministratoreConferma: null,
        },
        {
            idQuestionario: 'q-2',
            idPaziente: 'p-001',
            nomeTipologia: 'GAD-7',
            score: 8,
            risposte: {},
            cambiamento: false,
            dataCompilazione: '2023-10-25',
            revisionato: true,
            invalidato: false,
            noteInvalidazione: null,
            dataInvalidazione: null,
            idPsicologoRevisione: 'RSSMRA80A01H501Z',
            idPsicologoRichiedente: null,
            idAmministratoreConferma: null,
        },
        {
            idQuestionario: 'q-3',
            idPaziente: 'p-002',
            nomeTipologia: 'PHQ-9',
            score: 15,
            risposte: {},
            cambiamento: true,
            dataCompilazione: '2023-10-24',
            revisionato: true,
            invalidato: false,
            noteInvalidazione: null,
            dataInvalidazione: null,
            idPsicologoRevisione: 'RSSMRA80A01H501Z',
            idPsicologoRichiedente: null,
            idAmministratoreConferma: null,
        },
        {
            idQuestionario: 'q-4',
            idPaziente: 'p-003',
            nomeTipologia: 'BDI-II',
            score: 22,
            risposte: {},
            cambiamento: false,
            dataCompilazione: '2023-10-20',
            revisionato: false,
            invalidato: true,
            noteInvalidazione: 'Dati incongruenti',
            dataInvalidazione: '2023-10-21',
            idPsicologoRevisione: null,
            idPsicologoRichiedente: 'RSSMRA80A01H501Z',
            idAmministratoreConferma: 'admin@sintonia.it',
        },
    ];

    // Filter based on role
    if (role === 'psychologist') {
        // Psychologist sees only Compilato and Revisionato
        return mockData.filter(q => !q.invalidato);
    }

    // Admin sees all
    return mockData;
}
