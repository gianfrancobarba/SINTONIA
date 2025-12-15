import React, { useState, useEffect } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { getCurrentUser } from '../services/auth.service';
import PageHeader from '../components/PageHeader';
import type { OutletContextType } from '../components/AppLayout';
import {
    fetchPsychologistNotifications,
    fetchAdminNotifications,
    markPsychologistNotificationAsRead,
    markAdminNotificationAsRead,
    markAllPsychologistNotificationsAsRead,
    markAllAdminNotificationsAsRead,
} from '../services/notification.service';
import type { Notification } from '../types/notification';
import '../css/NotificationCenter.css';

const NotificationCenter: React.FC = () => {
    const location = useLocation();
    const isAdmin = location.pathname.includes('admin-dashboard');
    const { onProfileUpdate } = useOutletContext<OutletContextType>();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadNotifications = async () => {
        setLoading(true);
        setError(null);

        try {
            const user = getCurrentUser();
            if (!user) {
                throw new Error('Utente non autenticato');
            }

            let data;
            if (isAdmin) {
                data = await fetchAdminNotifications(user.email, 1);
            } else {
                const cf = user.fiscalCode || user.email;
                data = await fetchPsychologistNotifications(cf, 1);
            }

            // Filter to only show unread notifications
            let allNotifications: Notification[] = [];
            if (Array.isArray(data)) {
                allNotifications = data;
            } else if (data && data.notifications) {
                allNotifications = data.notifications;
            }

            // Only keep unread
            setNotifications(allNotifications.filter(n => !n.letto));
        } catch (err) {
            console.error('Error loading notifications:', err);
            setError(err instanceof Error ? err.message : 'Errore nel caricamento delle notifiche');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [isAdmin]);

    const handleMarkAsRead = async (idNotifica: string) => {
        try {
            if (isAdmin) {
                await markAdminNotificationAsRead(idNotifica);
            } else {
                await markPsychologistNotificationAsRead(idNotifica);
            }

            // Remove from list
            setNotifications((prev) =>
                prev.filter((n) => n.idNotifica !== idNotifica)
            );

            // Refresh sidebar badge
            onProfileUpdate();
        } catch (err) {
            console.error('Errore nel segnare la notifica come letta:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const user = getCurrentUser();
            if (!user) return;

            if (isAdmin) {
                await markAllAdminNotificationsAsRead(user.email);
            } else {
                const cf = user.fiscalCode || user.email;
                await markAllPsychologistNotificationsAsRead(cf);
            }

            // Clear all
            setNotifications([]);

            // Refresh sidebar badge
            onProfileUpdate();
        } catch (err) {
            console.error('Errore nel segnare tutte le notifiche come lette:', err);
        }
    };

    const formatTimeAgo = (dateString: string | null): string => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Adesso';
        if (diffMins < 60) return `${diffMins}m fa`;
        if (diffHours < 24) return `${diffHours}h fa`;
        if (diffDays < 7) return `${diffDays}g fa`;

        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'short',
        });
    };

    if (loading) {
        return (
            <div className="content-panel notification-center">
                <div className="notification-loading">
                    <div className="spinner"></div>
                    <p>Caricamento notifiche...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="content-panel notification-center">
                <div className="notification-error">
                    <h3>Si è verificato un errore</h3>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={loadNotifications}>
                        Riprova
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="content-panel notification-center fade-in">
            <PageHeader
                title="Notifiche"
                subtitle={`${notifications.length} ${notifications.length === 1 ? 'notifica non letta' : 'notifiche non lette'}`}
                icon={<Bell size={24} />}
            />

            {notifications.length > 0 && (
                <div className="notification-actions">
                    <button
                        className="mark-all-btn"
                        onClick={handleMarkAllAsRead}
                    >
                        <CheckCheck size={16} />
                        Segna tutte come lette
                    </button>
                </div>
            )}

            <div className="notification-content">
                {notifications.length === 0 ? (
                    <div className="unified-empty-state">
                        <div className="unified-empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        </div>
                        <h3 className="unified-empty-title">Nessuna notifica</h3>
                        <p className="unified-empty-message">
                            Sei in pari! Non hai notifiche da leggere.
                        </p>
                    </div>
                ) : (
                    <div className="notification-list">
                        {notifications.map((notification) => (
                            <div
                                key={notification.idNotifica}
                                className="notification-card"
                            >
                                <div className="notification-card-content">
                                    <div className="notification-main">
                                        <span className="unread-dot"></span>
                                        <div className="notification-text">
                                            <div className="notification-header-row">
                                                <h4 className="notification-title">{notification.titolo}</h4>
                                                {notification.tipologia && (
                                                    <span className="notification-type">{notification.tipologia}</span>
                                                )}
                                            </div>
                                            <p className="notification-description">{notification.descrizione}</p>
                                        </div>
                                    </div>
                                    <div className="notification-actions-col">
                                        <span className="notification-time">{formatTimeAgo(notification.dataInvio)}</span>
                                        <button
                                            className="mark-read-btn"
                                            onClick={() => handleMarkAsRead(notification.idNotifica)}
                                            title="Segna come letta"
                                        >
                                            <CheckCheck size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;
