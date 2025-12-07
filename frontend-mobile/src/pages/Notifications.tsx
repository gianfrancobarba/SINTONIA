import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, Bell, ChevronRight, ChevronLeft, Loader2, Smile } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead, type NotificationDto, type PaginatedNotificationsDto } from '../services/notification.service';
import '../css/Notifications.css';

const Notifications: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadNotifications(currentPage);
    }, [currentPage]);

    const loadNotifications = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const data: PaginatedNotificationsDto = await getNotifications(page);
            setNotifications(data.notifications);
            setTotalPages(data.totalPages);
            setTotal(data.total);
        } catch (err) {
            console.error('Error loading notifications:', err);
            setError('Errore nel caricamento delle notifiche');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification: NotificationDto) => {
        // Mark as read when clicked
        if (!notification.letto) {
            try {
                await markAsRead(notification.idNotifica);
                // Update local state
                setNotifications(prev =>
                    prev.map(n =>
                        n.idNotifica === notification.idNotifica ? { ...n, letto: true } : n
                    )
                );
            } catch (err) {
                console.error('Error marking notification as read:', err);
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
                navigate('/stato-animo');
                break;
            default:
                // No navigation for other types
                break;
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, letto: true })));
        } catch (err) {
            console.error('Error marking all as read:', err);
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
            {/* Header - Matching app style */}
            <div className="notifications-header">
                <div className="notifications-header-content">
                    <div className="notifications-title-section">
                        <h1 className="notifications-title">Notifiche</h1>
                        {total > 0 && (
                            <span className="notifications-count">{total}</span>
                        )}
                    </div>
                    {notifications.some(n => !n.letto) && (
                        <button
                            className="mark-all-read-btn"
                            onClick={handleMarkAllAsRead}
                        >
                            Segna tutte lette
                        </button>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="notifications-loading">
                    <Loader2 className="spinner" size={32} />
                    <p>Caricamento...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="notifications-error">
                    <p>{error}</p>
                    <button onClick={() => loadNotifications(currentPage)}>
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
                                className={`notification-card ${!notification.letto ? 'unread' : ''}`}
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
                                <ChevronRight size={20} className="notification-arrow" />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="notifications-pagination">
                            <button
                                className="pagination-btn"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="pagination-info">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                className="pagination-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Notifications;
