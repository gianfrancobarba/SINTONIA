import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { HomeDashboardDto } from '../types/home';
import type { ForumPost } from '../types/forum';
import type { DiaryPage } from '../types/diary';
import type { MonthYearOption } from '../services/diary.service';
import type { NotificationDto } from '../services/notification.service';
import type { ProfileDto } from '../types/profile';

interface CacheState {
    homeData: HomeDashboardDto | null;
    setHomeData: (data: HomeDashboardDto | null) => void;

    // Forum: both my questions and public questions
    forumData: { myQuestions: ForumPost[]; publicQuestions: ForumPost[] } | null;
    setForumData: (data: { myQuestions: ForumPost[]; publicQuestions: ForumPost[] } | null) => void;

    diaryPages: DiaryPage[] | null;
    setDiaryPages: (pages: DiaryPage[] | null) => void;

    diaryDateOptions: MonthYearOption[] | null;
    setDiaryDateOptions: (options: MonthYearOption[] | null) => void;

    notifications: NotificationDto[] | null;
    setNotifications: (notifications: NotificationDto[] | null) => void;

    profileData: ProfileDto | null;
    setProfileData: (data: ProfileDto | null) => void;

    // Helper to invalidate all cache (e.g. on logout)
    clearCache: () => void;
}

const CacheContext = createContext<CacheState | undefined>(undefined);

export const CacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [homeData, setHomeData] = useState<HomeDashboardDto | null>(null);
    const [forumData, setForumData] = useState<{ myQuestions: ForumPost[]; publicQuestions: ForumPost[] } | null>(null);
    const [diaryPages, setDiaryPages] = useState<DiaryPage[] | null>(null);
    const [diaryDateOptions, setDiaryDateOptions] = useState<MonthYearOption[] | null>(null);
    const [notifications, setNotifications] = useState<NotificationDto[] | null>(null);
    const [profileData, setProfileData] = useState<ProfileDto | null>(null);

    const clearCache = () => {
        setHomeData(null);
        setForumData(null);
        setDiaryPages(null);
        setDiaryDateOptions(null);
        setNotifications(null);
        setProfileData(null);
    };

    return (
        <CacheContext.Provider value={{
            homeData, setHomeData,
            forumData, setForumData,
            diaryPages, setDiaryPages,
            diaryDateOptions, setDiaryDateOptions,
            notifications, setNotifications,
            profileData, setProfileData,
            clearCache
        }}>
            {children}
        </CacheContext.Provider>
    );
};

export const useCache = () => {
    const context = useContext(CacheContext);
    if (!context) {
        throw new Error('useCache must be used within a CacheProvider');
    }
    return context;
};
