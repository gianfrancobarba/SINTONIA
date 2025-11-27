import type { GetQuestionarioDto, SubmitQuestionarioDto, QuestionarioResultDto, Risposta } from '../types/questionario';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Fetch questionnaire data by ID
 */
export const getQuestionario = async (idQuestionario: string): Promise<GetQuestionarioDto> => {
    try {
        const token = localStorage.getItem('patient_token');
        if (!token) {
            window.location.href = '/spid-info';
            throw new Error('Missing auth token. Redirecting to login...');
        }

        const response = await fetch(`${API_BASE_URL}/paziente/questionario/${idQuestionario}`, {
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
        console.error('Error fetching questionario:', error);
        throw error;
    }
};

/**
 * Start questionnaire by tipologia name and return created idQuestionario
 */
export const startQuestionario = async (nomeTipologia: string): Promise<GetQuestionarioDto> => {
    try {
        const token = localStorage.getItem('patient_token');
        if (!token) {
            window.location.href = '/spid-info';
            throw new Error('Missing auth token. Redirecting to login...');
        }

        const response = await fetch(`${API_BASE_URL}/paziente/questionario/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ nomeTipologia }),
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
        return data as GetQuestionarioDto;
    } catch (error) {
        console.error('Error starting questionario:', error);
        throw error;
    }
};

/**
 * Submit questionnaire answers
 */
export const submitQuestionario = async (
    idQuestionario: string,
    risposte: Risposta[]
): Promise<QuestionarioResultDto> => {
    try {
        const token = localStorage.getItem('patient_token');
        if (!token) {
            window.location.href = '/spid-info';
            throw new Error('Missing auth token. Redirecting to login...');
        }

        const payload: SubmitQuestionarioDto = { risposte };

        const response = await fetch(`${API_BASE_URL}/paziente/questionario/${idQuestionario}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
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
        console.error('Error submitting questionario:', error);
        throw error;
    }
};
