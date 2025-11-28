/**
 * Service layer for forum data
 * USING MOCK DATA - Backend endpoints not implemented yet
 */

import type { ForumQuestion, ForumAnswer, ForumStats, ForumCategory } from '../types/forum';
import { getCurrentUser } from './auth.service';

const API_URL = 'http://localhost:3000';

/**
 * MOCK DATA - Simulates forum questions
 */
const mockForumQuestions: ForumQuestion[] = [
    {
        idDomanda: '1',
        idPaziente: 'PAT001',
        categoria: 'Ansia',
        titolo: 'Sentirsi soli',
        testo: 'Mi sento sempre più stanco, demotivato, e ho la sensazione che non importa a nessuno se pago. È normale sentirsi così "abbandonati" dal sistema? Ho paura di non riuscire ad uscire ancora. C\'è qualcuno che si sente come me?',
        dataInserimento: '2025-11-28T14:00:00.000Z',
        hasAnswer: false
    },
    {
        idDomanda: '2',
        idPaziente: 'PAT002',
        categoria: 'Stress',
        titolo: 'Tensione',
        testo: 'Sono sempre teso, rispondo male al mio partner e ai miei colleghi per cose banali, e un minuto dopo mi sento terribilmente in colpa. C\'è un modo "d\'emergenza" per fermarmi prima di scattare?',
        dataInserimento: '2025-11-28T15:30:00.000Z',
        hasAnswer: true,
        risposta: {
            idRisposta: 'A1',
            idDomanda: '2',
            idPsicologo: 'PSI001',
            psychologistName: 'Dott. Pirillo',
            testo: 'Capisco perfettamente la tua situazione. Ti consiglio di praticare la tecnica del "respiro consapevole" prima di rispondere. Prendi 3 respiri profondi e conta fino a 10. Questo ti darà il tempo di calmarti e rispondere in modo più costruttivo.',
            dataRisposta: '2025-11-28T16:00:00.000Z'
        }
    },
    {
        idDomanda: '3',
        idPaziente: 'PAT003',
        categoria: 'Tristezza',
        titolo: 'Attacchi di panico',
        testo: 'Quasi ogni sera, quando cerco di dormire, mi vengono quei "nodi" allo stomaco e quella sensazione di soffocare (cuore a mille, paura). Esistono esercizi di respirazione o tecniche specifiche che posso usare in quel momento per calmarmi, senza parlare subito con uno specialista? Grazie',
        dataInserimento: '2025-11-28T13:00:00.000Z',
        hasAnswer: true,
        risposta: {
            idRisposta: 'A2',
            idDomanda: '3',
            idPsicologo: 'PSI001',
            psychologistName: 'Dott. Pirillo',
            testo: 'Gli attacchi di panico notturni sono molto comuni. Prova la respirazione 4-7-8: inspira per 4 secondi, trattieni per 7, espira per 8. Ripeti 3-4 volte. Anche la tecnica del grounding può aiutare: concentrati su 5 cose che vedi, 4 che tocchi, 3 che senti, 2 che annusi, 1 che gusti.',
            dataRisposta: '2025-11-28T14:30:00.000Z'
        }
    },
    {
        idDomanda: '4',
        idPaziente: 'PAT004',
        categoria: 'Vita di coppia',
        titolo: 'Comunicazione difficile',
        testo: 'Io e il mio partner non riusciamo più a comunicare senza litigare. Ogni conversazione finisce in discussione. Come possiamo migliorare la nostra comunicazione?',
        dataInserimento: '2025-11-28T12:00:00.000Z',
        hasAnswer: false
    },
    {
        idDomanda: '5',
        idPaziente: 'PAT005',
        categoria: 'Ansia',
        titolo: 'Ansia da prestazione',
        testo: 'Ho sempre ansia prima degli esami o presentazioni al lavoro. Come posso gestire meglio questa situazione?',
        dataInserimento: '2025-11-28T11:00:00.000Z',
        hasAnswer: false
    },
    {
        idDomanda: '6',
        idPaziente: 'PAT006',
        categoria: 'Stress',
        titolo: 'Sovraccarico lavorativo',
        testo: 'Lavoro troppo e non riesco a staccare neanche nei weekend. Mi sento sempre stanco e irritabile. Consigli?',
        dataInserimento: '2025-11-28T10:00:00.000Z',
        hasAnswer: false
    }
];

/**
 * Fetch forum questions for psychologist's patients
 * @param category Optional category filter
 * @returns Promise<ForumQuestion[]>
 */
export const fetchForumQuestions = async (
    category?: ForumCategory
): Promise<ForumQuestion[]> => {
    try {
        // MOCK IMPLEMENTATION
        // TODO: Replace with real API call when backend is ready
        // const token = getCurrentUser()?.access_token;
        // const cf = getCurrentUser()?.fiscalCode || getCurrentUser()?.email;
        // const endpoint = `/psi/forum/questions?cf=${cf}${category ? `&category=${category}` : ''}`;
        // const response = await axios.get(`${API_URL}${endpoint}`, {
        //     headers: {
        //         ...(token ? { Authorization: `Bearer ${token}` } : {}),
        //         'Content-Type': 'application/json',
        //     },
        // });
        // return response.data;

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let questions = [...mockForumQuestions];

        // Apply category filter if provided
        if (category) {
            questions = questions.filter(q => q.categoria === category);
        }

        return questions;
    } catch (error) {
        console.error('Error fetching forum questions:', error);
        throw error;
    }
};

/**
 * Fetch forum statistics
 * @returns Promise<ForumStats>
 */
export const fetchForumStats = async (): Promise<ForumStats> => {
    try {
        // MOCK IMPLEMENTATION
        await new Promise(resolve => setTimeout(resolve, 300));

        const totalQuestions = mockForumQuestions.length;
        const answeredQuestions = mockForumQuestions.filter(q => q.hasAnswer).length;
        const unansweredQuestions = totalQuestions - answeredQuestions;

        return {
            totalQuestions,
            answeredQuestions,
            unansweredQuestions
        };
    } catch (error) {
        console.error('Error fetching forum stats:', error);
        throw error;
    }
};

/**
 * Answer a forum question
 * @param questionId Question ID
 * @param content Answer content
 * @returns Promise<ForumAnswer>
 */
export const answerQuestion = async (
    questionId: string,
    content: string
): Promise<ForumAnswer> => {
    try {
        // MOCK IMPLEMENTATION
        // TODO: Replace with real API call
        // const token = getCurrentUser()?.access_token;
        // const cf = getCurrentUser()?.fiscalCode || getCurrentUser()?.email;
        // const response = await axios.post(
        //     `${API_URL}/psi/forum/questions/${questionId}/answer`,
        //     { testo: content },
        //     {
        //         headers: {
        //             ...(token ? { Authorization: `Bearer ${token}` } : {}),
        //             'Content-Type': 'application/json',
        //         },
        //     }
        // );
        // return response.data;

        await new Promise(resolve => setTimeout(resolve, 500));

        const user = getCurrentUser();
        const newAnswer: ForumAnswer = {
            idRisposta: `A${Date.now()}`,
            idDomanda: questionId,
            idPsicologo: user?.fiscalCode || user?.email || 'PSI001',
            psychologistName: 'Dott. Pirillo',
            testo: content,
            dataRisposta: new Date().toISOString()
        };

        // Update mock data
        const question = mockForumQuestions.find(q => q.idDomanda === questionId);
        if (question) {
            question.hasAnswer = true;
            question.risposta = newAnswer;
        }

        return newAnswer;
    } catch (error) {
        console.error('Error answering question:', error);
        throw error;
    }
};

/**
 * Update an existing answer
 * @param answerId Answer ID
 * @param content New answer content
 * @returns Promise<ForumAnswer>
 */
export const updateAnswer = async (
    answerId: string,
    content: string
): Promise<ForumAnswer> => {
    try {
        // MOCK IMPLEMENTATION
        await new Promise(resolve => setTimeout(resolve, 500));

        // Find and update answer in mock data
        for (const question of mockForumQuestions) {
            if (question.risposta?.idRisposta === answerId) {
                question.risposta.testo = content;
                question.risposta.dataRisposta = new Date().toISOString();
                return question.risposta;
            }
        }

        throw new Error('Answer not found');
    } catch (error) {
        console.error('Error updating answer:', error);
        throw error;
    }
};

/**
 * Delete an answer
 * @param answerId Answer ID
 * @returns Promise<void>
 */
export const deleteAnswer = async (answerId: string): Promise<void> => {
    try {
        // MOCK IMPLEMENTATION
        await new Promise(resolve => setTimeout(resolve, 500));

        // Find and delete answer in mock data
        for (const question of mockForumQuestions) {
            if (question.risposta?.idRisposta === answerId) {
                question.hasAnswer = false;
                question.risposta = undefined;
                return;
            }
        }

        throw new Error('Answer not found');
    } catch (error) {
        console.error('Error deleting answer:', error);
        throw error;
    }
};
