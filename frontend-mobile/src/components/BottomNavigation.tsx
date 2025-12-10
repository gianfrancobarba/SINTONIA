import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/BottomNavigation.css';
import { getUnreadCount } from '../services/notification.service';

// Import SVG icons
import forumIcon from '../assets/icons/forum.svg';
import diaryIcon from '../assets/icons/diary.svg';
import homeIcon from '../assets/icons/home.svg';
import notificationIcon from '../assets/icons/notification.svg';
import userIcon from '../assets/icons/user.svg';

interface NavItem {
    path: string;
    icon: string;
    label: string;
}

const BottomNavigation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);

    const navItems: NavItem[] = [
        { path: '/forum', icon: forumIcon, label: 'Forum' },
        { path: '/diary', icon: diaryIcon, label: 'Diario' },
        { path: '/home', icon: homeIcon, label: 'Home' },
        { path: '/notifications', icon: notificationIcon, label: 'Notifiche' },
        { path: '/profile', icon: userIcon, label: 'Profilo' }
    ];

    // Initial fetch and interval
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const data = await getUnreadCount();
                setUnreadCount(data.count);
            } catch (err) {
                console.error('Error fetching unread count:', err);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);

        return () => clearInterval(interval);
    }, []);

    // Refresh on location change (only if needed, ensuring no full reload)
    useEffect(() => {
        getUnreadCount().then(data => setUnreadCount(data.count)).catch(console.error);
    }, [location.pathname]);

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bottom-nav" role="navigation" aria-label="Navigazione principale">
            <div className="bottom-nav-background" />
            <div className="bottom-nav-items">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    const isNotification = item.path === '/notifications';

                    return (
                        <button
                            key={item.path}
                            className={`nav-item ${active ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                            aria-label={item.label}
                            aria-current={active ? 'page' : undefined}
                        >
                            <div className="nav-icon-wrapper">
                                <img
                                    src={item.icon}
                                    alt={item.label}
                                    className="nav-icon"
                                />
                                {isNotification && unreadCount > 0 && (
                                    <span className="notification-badge">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default React.memo(BottomNavigation);
