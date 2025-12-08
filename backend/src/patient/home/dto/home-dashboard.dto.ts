export class HomeDashboardDto {
    firstName: string;
    gender: string; // 'M' | 'F'
    mood: string;
    notificationsCount: number;
    streakLevel: number;
    streakProgress: number; // Percentage 0-100
    currentStreakDays: number; // Numero di giorni consecutivi di inserimento stato d'animo
    calendarDays: {
        day: string; // "Lun", "Mar"
        date: number; // 12, 13
        fullDate: string; // ISO date
        hasEvent: boolean;
        isToday: boolean;
        mood?: string; // "Felice", "Triste", etc.
    }[];
    suggestedPosts: {
        id: string;
        category: string;
        title: string;
        contentSnippet: string;
    }[];
}
