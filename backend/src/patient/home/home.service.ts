import { Injectable } from '@nestjs/common';
import { HomeDashboardDto } from '../dto/home-dashboard.dto.js';

@Injectable()
export class HomeService {
    async getDashboard(userId: number): Promise<HomeDashboardDto> {
        // Mock data based on the UI design
        return {
            firstName: 'Giuseppe',
            mood: 'Felice',
            notificationsCount: 3,
            streakLevel: 3,
            streakProgress: 75,
            dailyNote: '',
            calendarDays: [
                { day: 'Lun', date: 12, fullDate: '2025-12-12', hasEvent: true, isToday: false },
                { day: 'Mar', date: 13, fullDate: '2025-12-13', hasEvent: false, isToday: false },
                { day: 'Mer', date: 14, fullDate: '2025-12-14', hasEvent: true, isToday: false },
                { day: 'Gio', date: 15, fullDate: '2025-12-15', hasEvent: true, isToday: true },
                { day: 'Ven', date: 16, fullDate: '2025-12-16', hasEvent: false, isToday: false },
                { day: 'Sab', date: 17, fullDate: '2025-12-17', hasEvent: false, isToday: false },
                { day: 'Dom', date: 18, fullDate: '2025-12-18', hasEvent: false, isToday: false },
            ],
            suggestedPosts: [
                {
                    id: '1',
                    category: 'ANSIA',
                    title: 'Domani ho un esame e non so gestire l\'ansia...',
                    contentSnippet: 'Ho paura di fallire. Consigli?',
                },
                {
                    id: '2',
                    category: 'VITA DI COPPIA',
                    title: 'La mia ragazza mi ha lasciato...',
                    contentSnippet: 'Adesso mi sento solo come posso fare?',
                },
            ],
        };
    }
}
