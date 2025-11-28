import type { ForumPost, CreatePostDto, ForumCategory, CategoryInfo } from '../types/forum';

// Mock data per testing
const mockPosts: ForumPost[] = [
    {
        id: '1',
        title: 'Sentirsi soli',
        content: 'Mi sento sempre più stanco, demotivato, e ho la sensazione che non importa a nessuno se peggioro. È normale sentirsi così "abbandonati" dal sistema? Ho paura di non riuscire ad apprezzare ancora. C\'è qualcuno che si sente come me?',
        category: 'tristezza',
        author: 'User123',
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minuti fa
    },
    {
        id: '2',
        title: 'Tensione',
        content: 'Sono sempre teso, rispondo male al mia partner e ai miei colleghi per cose banali, e un minuto dopo mi sento terribilmente in colpa. C\'è un modo "emergenza" per fermarmi prima di scattare?',
        category: 'stress',
        author: 'User456',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 ore fa
    },
    {
        id: '3',
        title: 'Attacchi di panico',
        content: 'Quasi ogni sera, quando cerco di dormire, mi vengono quelli che chiamano "attacchi di panico" (cuore a mille, sensazione di soffocare, paura). Esistono esercizi di respirazione o tecniche specifiche che posso usare in quei momenti per calmarmi, piuttosto che parlare con uno specialista? Grazie',
        category: 'ansia',
        author: 'User789',
        createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 ora fa
    },
    {
        id: '4',
        title: 'Comunicazione difficile',
        content: 'Io e il mio partner non riusciamo più a comunicare senza litigare. Ogni discussione finisce male. Come possiamo migliorare?',
        category: 'vita_di_coppia',
        author: 'User234',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 giorni fa
    },
    {
        id: '5',
        title: 'Preoccupazioni costanti',
        content: 'Non riesco a smettere di preoccuparmi per tutto. Anche le piccole cose diventano enormi nella mia mente.',
        category: 'ansia',
        author: 'User567',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 ore fa
    },
    {
        id: '6',
        title: 'Lavoro e vita privata',
        content: 'Il mio lavoro mi consuma completamente. Non ho più tempo per me stesso o per la mia famiglia.',
        category: 'stress',
        author: 'User890',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 ore fa
    },
];

export const categoryInfo: CategoryInfo[] = [
    { id: 'ansia', label: 'Ansia', color: '#FB923C' },
    { id: 'stress', label: 'Stress', color: '#FB923C' },
    { id: 'tristezza', label: 'Tristezza', color: '#8B5CF6' },
    { id: 'vita_di_coppia', label: 'Vita di coppia', color: '#10B981' },
];

// Simula una chiamata API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getForumPosts = async (): Promise<ForumPost[]> => {
    await delay(300);
    return [...mockPosts];
};

export const getForumPostsByCategory = async (categories: ForumCategory[]): Promise<ForumPost[]> => {
    await delay(300);
    if (categories.length === 0) {
        return [...mockPosts];
    }
    return mockPosts.filter(post => categories.includes(post.category));
};

export const createPost = async (data: CreatePostDto): Promise<ForumPost> => {
    await delay(300);
    const newPost: ForumPost = {
        id: Date.now().toString(),
        ...data,
        author: 'CurrentUser',
        createdAt: new Date(),
    };
    mockPosts.unshift(newPost);
    return newPost;
};

export const deletePost = async (id: string): Promise<void> => {
    await delay(300);
    const index = mockPosts.findIndex(post => post.id === id);
    if (index !== -1) {
        mockPosts.splice(index, 1);
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
