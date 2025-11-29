import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, MessageSquare, Smile, ChevronRight } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import '../css/Notifications.css';

interface Notification {
    id: string;
    icon: 'questionnaire' | 'message' | 'mood';
    title: string;
    description: string;
    hasAction: boolean;
    actionRoute?: string;
}

const Notifications: React.FC = () => {
    const navigate = useNavigate();

    // Mock notifications - in futuro verranno dal backend
    const notifications: Notification[] = [
        {
            id: '1',
            icon: 'questionnaire',
            title: 'Compila il questionario di oggi!',
            description: 'C\'è un questionario da compilare',
            hasAction: true,
            actionRoute: '/questionari'
        }
    ];

    const handleBack = () => {
        navigate(-1);
    };

    const handleNotificationClick = (notification: Notification) => {
        if (notification.hasAction && notification.actionRoute) {
            navigate(notification.actionRoute);
        }
    };

    const getIconComponent = (iconType: string) => {
        switch (iconType) {
            case 'questionnaire':
                return <FileText size={24} strokeWidth={2.5} />;
            case 'message':
                return <MessageSquare size={24} strokeWidth={2.5} />;
            case 'mood':
                return <Smile size={24} strokeWidth={2.5} />;
            default:
                return null;
        }
    };

    const getIconClass = (iconType: string) => {
        switch (iconType) {
            case 'questionnaire':
                return 'notification-icon-green';
            case 'message':
                return 'notification-icon-blue';
            case 'mood':
                return 'notification-icon-cyan';
            default:
                return '';
        }
    };

    return (
        <div className="notifications-page">
            {/* Header */}
            <div className="notifications-header">
                <button className="notifications-back-btn" onClick={handleBack} aria-label="Indietro">
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
            </div>

            {/* Title with Badge */}
            <div className="notifications-title-section">
                <h1 className="notifications-title">Notifiche</h1>
                <span className="notifications-badge">+{notifications.length}</span>
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="notification-card"
                        onClick={() => handleNotificationClick(notification)}
                        style={{ cursor: notification.hasAction ? 'pointer' : 'default' }}
                    >
                        <div className={`notification-icon ${getIconClass(notification.icon)}`}>
                            {getIconComponent(notification.icon)}
                        </div>
                        <div className="notification-content">
                            <h3 className="notification-title">{notification.title}</h3>
                            {notification.description && (
                                <p className="notification-description">{notification.description}</p>
                            )}
                        </div>
                        {notification.hasAction && (
                            <ChevronRight size={20} className="notification-arrow" />
                        )}
                    </div>
                ))}
            </div>

            <BottomNavigation />
        </div>
    );
};

export default Notifications;
