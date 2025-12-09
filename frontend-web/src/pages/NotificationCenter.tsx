import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, CheckCheck, Inbox } from 'lucide-react';
import { getCurrentUser } from '../services/auth.service';
import PageHeader from '../components/PageHeader';
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

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalNotifications, setTotalNotifications] = useState(0);

    const loadNotifications = async (page: number = 1) => {
        setLoading(true);
        setError(null);

        try {
            const user = getCurrentUser();
            if (!user) {
                throw new Error('Utente non autenticato');
            }

            let data;
            if (isAdmin) {
                data = await fetchAdminNotifications(user.email, page);
            } else {
                const cf = user.fiscalCode || user.email;
                data = await fetchPsychologistNotifications(cf, page);
            }

            console.log('Notifications response:', data);

            // Handle both paginated response (object) and old array response
            if (Array.isArray(data)) {
                // Old format - array of notifications
                setNotifications(data);
                setTotalNotifications(data.length);
                setTotalPages(1);
                setCurrentPage(1);
            } else if (data && data.notifications) {
                // New paginated format
                setNotifications(data.notifications);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
                setTotalNotifications(data.total);
            } else {
                setNotifications([]);
                setTotalNotifications(0);
                setTotalPages(1);
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error loading notifications:', err);
            setError(err instanceof Error ? err.message : 'Errore nel caricamento delle notifiche');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications(1);
    }, [isAdmin]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            loadNotifications(newPage);
        }
    };

    const handleMarkAsRead = async (idNotifica: string) => {
        try {
            if (isAdmin) {
                await markAdminNotificationAsRead(idNotifica);
            } else {
                await markPsychologistNotificationAsRead(idNotifica);
            }

            setNotifications((prev) =>
                prev.map((n) =>
                    n.idNotifica === idNotifica ? { ...n, letto: true } : n
                )
            );
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

            setNotifications((prev) =>
                prev.map((n) => ({ ...n, letto: true }))
            );
        } catch (err) {
            console.error('Errore nel segnare tutte le notifiche come lette:', err);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Adesso';
        if (diffMins < 60) return `${diffMins} min fa`;
        if (diffHours < 24) return `${diffHours} ore fa`;
        if (diffDays < 7) return `${diffDays} giorni fa`;

        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const unreadCount = (notifications || []).filter((n) => !n.letto).length;

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
                    <button className="retry-btn" onClick={() => loadNotifications(currentPage)}>
                        Riprova
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="content-panel notification-center">
            <PageHeader
                title="Centro Notifiche"
                subtitle="Tutte le tue notifiche in un unico posto"
                icon={<Bell size={24} />}
            />
            <div className="notification-header">
                {unreadCount > 0 && (
                    <button
                        className="mark-all-read-btn"
                        onClick={handleMarkAllAsRead}
                    >
                        <CheckCheck size={18} />
                        Segna tutte come lette
                    </button>
                )}
            </div>

            <div className="notification-stats">
                <div className="stat-card">
                    <div className="stat-icon total">
                        <Bell size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{totalNotifications}</h3>
                        <p>Notifiche totali</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon unread">
                        <Inbox size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{unreadCount}</h3>
                        <p>Non lette (pagina)</p>
                    </div>
                </div>
            </div>

            {(!notifications || notifications.length === 0) ? (
                <div className="notification-empty">
                    <Bell size={80} />
                    <h3>Nessuna notifica</h3>
                    <p>Non hai ancora ricevuto notifiche dalla piattaforma</p>
                </div>
            ) : (
                <>
                    <div className="notification-list">
                        {notifications.map((notification) => (
                            <div
                                key={notification.idNotifica}
                                className={`notification-card ${notification.letto ? 'read' : 'unread'}`}
                                onClick={() => !notification.letto && handleMarkAsRead(notification.idNotifica)}
                            >
                                <div className="notification-card-header">
                                    <div className="notification-title-wrapper">
                                        <h3 className="notification-title">
                                            {!notification.letto && <span className="unread-indicator"></span>}
                                            <span className="notification-title-text">{notification.titolo}</span>
                                        </h3>
                                        {notification.tipologia && (
                                            <span className="notification-badge">
                                                {notification.tipologia}
                                            </span>
                                        )}
                                    </div>
                                    <span className="notification-date">
                                        {formatDate(notification.dataInvio)}
                                    </span>
                                </div>
                                <p className="notification-description">
                                    {notification.descrizione}
                                </p>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-button"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Precedente
                            </button>
                            <span className="pagination-info">
                                Pagina {currentPage} di {totalPages}
                            </span>
                            <button
                                className="pagination-button"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Successiva
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default NotificationCenter;
