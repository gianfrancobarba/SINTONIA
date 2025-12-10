import type { ForumPost, CreatePostDto, ForumCategory, CategoryInfo, UpdatePostDto } from '../types/forum';

const API_BASE_URL = 'http://localhost:3000';

export const categoryInfo: CategoryInfo[] = [
    { id: 'ansia', label: 'Ansia', color: '#EAB308' },
    { id: 'stress', label: 'Stress', color: '#D32F2F' },
    { id: 'tristezza', label: 'Tristezza', color: '#8B5CF6' },
    { id: 'vita_di_coppia', label: 'Vita di coppia', color: '#EC4899' },
];

// Mappa le categorie dal formato frontend-mobile al formato backend/web
// 'ansia' -> 'Ansia', 'vita_di_coppia' -> 'Vita di Coppia'
const categoryToBackendFormat: Record<ForumCategory, string> = {
    'ansia': 'Ansia',
    'stress': 'Stress',
    'tristezza': 'Tristezza',
    'vita_di_coppia': 'Vita di Coppia',
};

// Helper per gestire autenticazione
const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('patient_token');
    if (!token) {
        window.location.href = '/spid-info';
        throw new Error('Missing auth token. Redirecting to login...');
    }
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
};

// Helper per gestire errori di autenticazione
const handleAuthError = (response: Response) => {
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('patient_token');
        window.location.href = '/spid-info';
        throw new Error('Unauthorized. Redirecting to login...');
    }
};

// Mapping da backend DTO a frontend type
const mapQuestionToPost = (question: any): ForumPost => {
    return {
        id: question.idDomanda,
        title: question.titolo,
        content: question.testo,
        category: (question.categoria || '').toLowerCase().replace(/ /g, '_') as ForumCategory,
        author: 'User', // Il backend non ritorna l'autore per la privacy
        createdAt: new Date(question.dataInserimento),
        answers: question.risposte || [],
    };
};

/**
 * Get all forum posts (user's questions + public questions with answers)
 */
export const getForumPosts = async (): Promise<{ myQuestions: ForumPost[], publicQuestions: ForumPost[] }> => {
    try {
        const headers = getAuthHeaders();

        // Chiamate parallele per ottimizzazione
        const [myQuestionsRes, publicQuestionsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/patient/forum/my-questions`, { headers }),
            fetch(`${API_BASE_URL}/patient/forum/public-questions`, { headers }),
        ]);

        handleAuthError(myQuestionsRes);
        handleAuthError(publicQuestionsRes);

        if (!myQuestionsRes.ok || !publicQuestionsRes.ok) {
            throw new Error('Failed to fetch forum posts');
        }

        const myQuestionsData = await myQuestionsRes.json();
        const publicQuestionsData = await publicQuestionsRes.json();

        return {
            myQuestions: myQuestionsData.map(mapQuestionToPost),
            publicQuestions: publicQuestionsData.map(mapQuestionToPost),
        };
    } catch (error) {
        console.error('Error fetching forum posts:', error);
        throw error;
    }
};

/**
 * Create a new forum post
 */
export const createPost = async (data: CreatePostDto): Promise<ForumPost> => {
    try {
        const headers = getAuthHeaders();

        const payload = {
            titolo: data.title,
            testo: data.content,
            categoria: categoryToBackendFormat[data.category],
        };

        const response = await fetch(`${API_BASE_URL}/paziente/forum/domanda`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        handleAuthError(response);

        if (!response.ok) {
            throw new Error(`Failed to create post: ${response.status}`);
        }

        const result = await response.json();

        // Costruisci il post dalla risposta
        return {
            id: result.idDomanda,
            title: data.title,
            content: data.content,
            category: data.category,
            author: 'CurrentUser',
            createdAt: new Date(),
            answers: [],
        };
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

/**
 * Update an existing forum post
 */
export const updatePost = async (id: string, data: UpdatePostDto): Promise<void> => {
    try {
        const headers = getAuthHeaders();

        const payload: any = {};
        if (data.title !== undefined) payload.titolo = data.title;
        if (data.content !== undefined) payload.testo = data.content;
        if (data.category !== undefined) payload.categoria = categoryToBackendFormat[data.category];

        const response = await fetch(`${API_BASE_URL}/paziente/forum/domanda/${id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(payload),
        });

        handleAuthError(response);

        if (!response.ok) {
            throw new Error(`Failed to update post: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
};

/**
 * Delete a forum post
 */
export const deletePost = async (id: string): Promise<void> => {
    try {
        const headers = getAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/paziente/forum/domanda/${id}`, {
            method: 'DELETE',
            headers,
        });

        handleAuthError(response);

        if (!response.ok) {
            throw new Error(`Failed to delete post: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

// Helper function per formattare timestamp relativi
export const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ora';
    if (diffMins < 60) return `${diffMins}m fa`;
    if (diffHours < 24) return `${diffHours}h fa`;
    if (diffDays < 7) return `${diffDays}d fa`;
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
};
