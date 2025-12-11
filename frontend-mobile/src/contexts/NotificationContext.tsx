import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUnreadCount } from '../services/notification.service';
import { useLocation } from 'react-router-dom';

interface NotificationContextType {
    unreadCount: number;
    refreshUnreadCount: () => Promise<void>;
    decrementUnreadCount: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();

    const refreshUnreadCount = useCallback(async () => {
        try {
            const data = await getUnreadCount();
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }, []);

    const decrementUnreadCount = useCallback(() => {
        setUnreadCount((prev) => Math.max(0, prev - 1));
    }, []);

    // Initial fetch and periodic polling
    useEffect(() => {
        refreshUnreadCount();
        const interval = setInterval(refreshUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [refreshUnreadCount]);

    // Refresh on location change (optional, but good for keeping sync)
    useEffect(() => {
        refreshUnreadCount();
    }, [location.pathname, refreshUnreadCount]);

    return (
        <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount, decrementUnreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
