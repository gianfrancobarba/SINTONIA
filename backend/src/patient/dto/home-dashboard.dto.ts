export class HomeDashboardDto {
    firstName: string;
    mood: string;
    notificationsCount: number;
    streakLevel: number;
    streakProgress: number; // Percentage 0-100
    dailyNote?: string; // Content of the note if it exists
    calendarDays: {
        day: string; // "Lun", "Mar"
        date: number; // 12, 13
        fullDate: string; // ISO date
        hasEvent: boolean;
        isToday: boolean;
    }[];
    suggestedPosts: {
        id: string;
        category: string;
        title: string;
        contentSnippet: string;
    }[];
}
