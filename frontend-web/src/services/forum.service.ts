/**
 * Service layer for forum data
 * Connects to backend forum APIs
 */

import axios from 'axios';
import type { ForumQuestion, ForumAnswer, ForumStats, ForumCategory } from '../types/forum';
import { getCurrentUser } from './auth.service';

const API_URL = 'http://localhost:3000';

/**
 * Fetch forum questions
 * Uses appropriate endpoint based on user role (psi or admin)
 * @param category Optional category filter
 * @returns Promise<ForumQuestion[]>
 */
export const fetchForumQuestions = async (
    category?: ForumCategory
): Promise<ForumQuestion[]> => {
    try {
        const user = getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const token = user.access_token;
        const role = user.role;

        // Determine endpoint based on role
        const endpoint = role === 'admin'
            ? '/admin/forum/all'
            : '/psi/forum/all';

        const params: Record<string, string> = {};
        if (category) {
            params.categoria = category;
        }

        const response = await axios.get<ForumQuestion[]>(`${API_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching forum questions:', error);
        throw error;
    }
};

/**
 * Fetch forum statistics
 * Calculates stats from fetched questions
 * @returns Promise<ForumStats>
 */
export const fetchForumStats = async (): Promise<ForumStats> => {
    try {
        const user = getCurrentUser();
        const currentUserFiscalCode = user?.fiscalCode;

        // Fetch all questions (without category filter) to calculate stats
        const questions = await fetchForumQuestions();

        const totalQuestions = questions.length;

        // Count questions with no answers at all
        const unansweredQuestions = questions.filter(q =>
            !q.risposte || q.risposte.length === 0
        ).length;

        // Count questions where *I* have answered
        const answeredQuestions = questions.filter(q =>
            q.risposte && q.risposte.some(r => r.idPsicologo === currentUserFiscalCode)
        ).length;

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
 * TODO: Backend endpoint not implemented yet
 * @param questionId Question ID
 * @param content Answer content
 * @returns Promise<ForumAnswer>
 */
export const answerQuestion = async (
    questionId: string,
    content: string
): Promise<ForumAnswer> => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const token = user.access_token;
    const role = user.role;

    // Only psychologists can answer for now based on backend implementation
    const endpoint = role === 'admin'
        ? `/admin/forum/questions/${questionId}/answer`
        : `/psi/forum/questions/${questionId}/answer`;

    const response = await axios.post(
        `${API_URL}${endpoint}`,
        { testo: content },
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data;
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
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const token = user.access_token;
    const role = user.role;

    const endpoint = role === 'admin'
        ? `/admin/forum/answers/${answerId}`
        : `/psi/forum/answers/${answerId}`;

    const response = await axios.put(
        `${API_URL}${endpoint}`,
        { testo: content },
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data;
};

/**
 * Delete an answer
 * @param answerId Answer ID
 * @returns Promise<void>
 */
export const deleteAnswer = async (answerId: string): Promise<void> => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const token = user.access_token;
    const role = user.role;

    const endpoint = role === 'admin'
        ? `/admin/forum/answers/${answerId}`
        : `/psi/forum/answers/${answerId}`;

    await axios.delete(`${API_URL}${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};
