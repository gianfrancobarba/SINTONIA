import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, Bell, ChevronRight, ChevronLeft, Smile, Check } from 'lucide-react';
import { getNotifications, markAsRead, type NotificationDto, type PaginatedNotificationsDto } from '../services/notification.service';
import LoadingSpinner from '../components/LoadingSpinner';
import '../css/Notifications.css';
import { useNotification } from '../contexts/NotificationContext';
import { useCache } from '../contexts/CacheContext';

const Notifications: React.FC = () => {
    const navigate = useNavigate();

    // Use CacheContext
    const { notifications: cachedNotifications, setNotifications: setCachedNotifications } = useCache();
    const notifications = cachedNotifications || [];

    // Loading is true only if we don't have cached data yet
    const [loading, setLoading] = useState(!cachedNotifications);

    const [error, setError] = useState<string | null>(null);
    const { decrementUnreadCount, refreshUnreadCount } = useNotification();

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            if (!cachedNotifications) setLoading(true);
            setError(null);

            // Fetch first page to get metadata
            const firstPageData = await getNotifications(1);
            let allNotifications = [...firstPageData.notifications];

            // If there are more pages, fetch them all in parallel
            if (firstPageData.totalPages > 1) {
                const pagePromises = [];
                for (let i = 2; i <= firstPageData.totalPages; i++) {
                    pagePromises.push(getNotifications(i));
                }

                const otherPagesData = await Promise.all(pagePromises);
                otherPagesData.forEach(data => {
                    allNotifications = [...allNotifications, ...data.notifications];
                });
            }

            setCachedNotifications(allNotifications);
        } catch (err) {
            console.error('Error loading notifications:', err);
            setError('Errore nel caricamento delle notifiche');
        } finally {
            setLoading(false);
            // Refresh count deeply to ensure sync
            refreshUnreadCount();
        }
    };

    const handleNotificationClick = async (notification: NotificationDto) => {
        // Mark as read immediately when clicked
        if (!notification.letto) {
            try {
                // Optimistic update
                decrementUnreadCount();
                // We don't await this to ensure navigation speed, but we trigger it
                markAsRead(notification.idNotifica).catch(err => console.error(err));

                // Also update local state to remove it or mark it read
                const currentList = cachedNotifications || [];
                setCachedNotifications(currentList.filter(n => n.idNotifica !== notification.idNotifica));
            } catch (err) {
                console.error('Error handling notification click:', err);
            }
        }

        // Navigate based on tipologia
        switch (notification.tipologia) {
            case 'FORUM':
                navigate('/forum');
                break;
            case 'QUESTIONARIO':
                navigate('/questionari');
                break;
            case 'STATO_ANIMO':
                navigate('/mood-entry');
                break;
            default:
                break;
        }
    };

    const handleMarkAsRead = async (e: React.MouseEvent, notification: NotificationDto) => {
        e.stopPropagation(); // Prevent card click
        try {
            await markAsRead(notification.idNotifica);
            // Remove notification from local state (cache)
            const currentList = cachedNotifications || [];
            setCachedNotifications(currentList.filter(n => n.idNotifica !== notification.idNotifica));

            // Update global badge
            decrementUnreadCount();
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const getIconComponent = (tipologia: string | null) => {
        switch (tipologia) {
            case 'QUESTIONARIO':
                return <FileText size={24} strokeWidth={2.5} />;
            case 'FORUM':
                return <MessageSquare size={24} strokeWidth={2.5} />;
            case 'STATO_ANIMO':
                return <Smile size={24} strokeWidth={2.5} />;
            default:
                return <Bell size={24} strokeWidth={2.5} />;
        }
    };

    const getIconClass = (tipologia: string | null) => {
        switch (tipologia) {
            case 'QUESTIONARIO':
                return 'notification-icon-green';
            case 'FORUM':
                return 'notification-icon-blue';
            case 'STATO_ANIMO':
                return 'notification-icon-cyan';
            default:
                return 'notification-icon-cyan';
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
        if (diffDays === 1) return 'Ieri';
        return date.toLocaleDateString('it-IT');
    };

    return (
        <div className="notifications-page">
            {/* Header */}
            <div className="notifications-header">
                <div className="notifications-header-content">
                    <div className="notifications-title-section">
                        <h1 className="notifications-title">Notifiche</h1>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="loading-screen">
                    <LoadingSpinner />
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="notifications-error">
                    <p>{error}</p>
                    <button onClick={() => loadNotifications()}>
                        Riprova
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && notifications.length === 0 && (
                <div className="notifications-empty">
                    <Bell size={48} className="empty-icon" />
                    <p>Nessuna notifica</p>
                </div>
            )}

            {/* Notifications List */}
            {!loading && !error && notifications.length > 0 && (
                <>
                    <div className="notifications-list">
                        {notifications.map((notification) => (
                            <div
                                key={notification.idNotifica}
                                className="notification-card"
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className={`notification-icon ${getIconClass(notification.tipologia)}`}>
                                    {getIconComponent(notification.tipologia)}
                                </div>
                                <div className="notification-content">
                                    <h3 className="notification-title">{notification.titolo}</h3>
                                    {notification.descrizione && (
                                        <p className="notification-description">{notification.descrizione}</p>
                                    )}
                                    <span className="notification-date">
                                        {formatDate(notification.dataInvio)}
                                    </span>
                                </div>

                                {/* Mark as read button - only for persistent notifications */}
                                {!notification.isDynamic ? (
                                    <button
                                        className="mark-read-btn"
                                        onClick={(e) => handleMarkAsRead(e, notification)}
                                        aria-label="Segna come letta"
                                    >
                                        <Check size={18} />
                                    </button>
                                ) : (
                                    <ChevronRight size={20} className="notification-arrow" />
                                )}
                            </div>
                        ))}
                    </div>


                </>
            )}
        </div>
    );
};

export default Notifications;
