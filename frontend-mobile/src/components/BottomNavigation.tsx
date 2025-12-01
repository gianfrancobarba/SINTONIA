import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Users, Bell, User } from 'lucide-react';
import '../css/BottomNavigation.css';

interface NavItem {
    path: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
    label: string;
    isCenter?: boolean;
}

const BottomNavigation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems: NavItem[] = [
        { path: '/forum', icon: Users, label: 'Forum' },
        { path: '/diary', icon: BookOpen, label: 'Diario' },
        { path: '/home', icon: Home, label: 'Home', isCenter: true },
        { path: '/notifications', icon: Bell, label: 'Notifiche' },
        { path: '/profile', icon: User, label: 'Profilo' }
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bottom-nav" role="navigation" aria-label="Navigazione principale">
            <div className="bottom-nav-background" />
            <div className="bottom-nav-items">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <button
                            key={item.path}
                            className={`nav-item ${item.isCenter ? 'nav-item-center' : ''} ${active ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                            aria-label={item.label}
                            aria-current={active ? 'page' : undefined}
                        >
                            <Icon
                                size={item.isCenter ? 28 : 24}
                                strokeWidth={active ? 2.5 : 2}
                            />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavigation;
