import type { DiaryPage, CreateDiaryPageDto, UpdateDiaryPageDto } from '../types/diary';

// Mock data - simulazione di pagine di diario
const mockDiaryPages: DiaryPage[] = [
    {
        id: '1',
        title: 'Ansia per Sitemi Operativi',
        content: `Stanotte è stata un'altra notte insonne, ho paura di fallire. Ormai l'ansia la fa fa padrone, sono solo e non ho nessuno con cui parlarne. Mamma e Papà continuano a chiedermi di laurearmi in tempo per non dover pagare le tasse extra quest'anno. Non riesco a pensare ne a fare altro. Sono al limite...`,
        createdAt: new Date('2024-11-28T22:30:00'),
    },
    {
        id: '2',
        title: 'Giornata Positiva',
        content: `Oggi è andata meglio. Ho parlato con un amico e mi sono sentito un po' più leggero. Forse le cose miglioreranno. Ho anche fatto una passeggiata al parco e ho notato quanto mi faccia bene stare all'aria aperta.`,
        createdAt: new Date('2024-11-27T18:15:00'),
    },
    {
        id: '3',
        title: 'Riflessioni sulla terapia',
        content: `La sessione di oggi con lo psicologo è stata intensa. Abbiamo parlato delle mie paure e di come affrontarle. Mi sento ancora vulnerabile ma più consapevole. È un percorso lungo ma necessario.`,
        createdAt: new Date('2024-11-26T14:45:00'),
    },
    {
        id: '4',
        title: 'Momenti di serenità',
        content: `Questa mattina mi sono svegliato con una sensazione diversa. Il sole filtrava dalla finestra e per un momento ho sentito pace. Piccoli passi verso il benessere.`,
        createdAt: new Date('2024-11-25T09:20:00'),
    },
];

/**
 * Get all diary pages ordered by date (most recent first)
 */
export const getDiaryPages = async (): Promise<DiaryPage[]> => {
    // Simula un delay di rete
    await new Promise(resolve => setTimeout(resolve, 300));

    // Ritorna le pagine ordinate dalla più recente alla più vecchia
    return [...mockDiaryPages].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

/**
 * Get a single diary page by ID
 */
export const getDiaryPage = async (id: string): Promise<DiaryPage | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const page = mockDiaryPages.find(p => p.id === id);
    return page || null;
};

/**
 * Create a new diary page (MOCK - verrà implementato con backend)
 */
export const createDiaryPage = async (data: CreateDiaryPageDto): Promise<DiaryPage> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const newPage: DiaryPage = {
        id: String(mockDiaryPages.length + 1),
        title: data.title,
        content: data.content,
        createdAt: new Date(),
    };

    mockDiaryPages.unshift(newPage);
    return newPage;
};

/**
 * Update an existing diary page (MOCK - verrà implementato con backend)
 */
export const updateDiaryPage = async (id: string, data: UpdateDiaryPageDto): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const pageIndex = mockDiaryPages.findIndex(p => p.id === id);
    if (pageIndex !== -1) {
        mockDiaryPages[pageIndex] = {
            ...mockDiaryPages[pageIndex],
            ...data,
            updatedAt: new Date(),
        };
    }
};

/**
 * Delete a diary page (MOCK - verrà implementato con backend)
 */
export const deleteDiaryPage = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const pageIndex = mockDiaryPages.findIndex(p => p.id === id);
    if (pageIndex !== -1) {
        mockDiaryPages.splice(pageIndex, 1);
    }
};

/**
 * Get available months and years from diary pages
 */
export interface MonthYearOption {
    month?: number; // 0-11 (JavaScript month format)
    year?: number;
    label: string;
}

export const getAvailableMonthsYears = async (): Promise<MonthYearOption[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const monthYearSet = new Set<string>();

    mockDiaryPages.forEach(page => {
        const date = new Date(page.createdAt);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        monthYearSet.add(key);
    });

    const options: MonthYearOption[] = [
        { label: 'Tutti', month: undefined, year: undefined }
    ];

    // Converti il set in array e ordina
    const sorted = Array.from(monthYearSet)
        .map(key => {
            const [year, month] = key.split('-').map(Number);
            return { year, month };
        })
        .sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year; // Anno decrescente
            return b.month - a.month; // Mese decrescente
        });

    sorted.forEach(({ year, month }) => {
        const monthNames = [
            'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
            'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
        ];
        options.push({
            month,
            year,
            label: `${monthNames[month]} ${year}`
        });
    });

    return options;
};

/**
 * Format date for diary display
 */
export const formatDiaryDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Oggi';
    if (diffDays === 1) return 'Ieri';
    if (diffDays < 7) return `${diffDays} giorni fa`;

    return date.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
};
