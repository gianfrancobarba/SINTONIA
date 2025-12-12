export interface CalendarDay {
    day: string;
    date: number;
    fullDate: string;
    hasEvent: boolean;
    isToday: boolean;
    mood?: string;
}

export interface SuggestedPost {
    id: string;
    category: string;
    title: string;
    contentSnippet: string;
}

export interface HomeDashboardDto {
    firstName: string;
    gender: string; // 'M' | 'F'
    mood: string;
    notificationsCount: number;
    streakLevel: number;
    streakProgress: number;
    currentStreakDays: number;
    dailyNote: string;
    calendarDays: CalendarDay[];
    suggestedPosts: SuggestedPost[];
}
