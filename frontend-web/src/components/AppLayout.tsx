import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import PsychologistProfile from './PsychologistProfile';
import AdminProfile from './AdminProfile';
import '../css/AppLayout.css';

interface AppLayoutProps {
    role: 'psychologist' | 'admin';
}

const AppLayout: React.FC<AppLayoutProps> = ({ role }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Close sidebar when window resizes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Memoize active section calculation to prevent unnecessary re-renders
    const activeSection = useMemo(() => {
        const path = location.pathname;

        if (role === 'psychologist') {
            if (path.includes('/patients')) return 'pazienti';
            if (path.includes('/questionnaires')) return 'questionari';
            if (path.includes('/forum')) return 'forum';
            if (path.includes('/clinical-alerts')) return 'alert';
            if (path.includes('/technical-support')) return 'supporto-tecnico';
            if (path.includes('/personal-area')) return 'area-personale';
            if (path.includes('/notifications')) return 'notifiche';
        } else {
            if (path.includes('/patients')) return 'pazienti';
            if (path.includes('/psychologists')) return 'psicologi';
            if (path.includes('/questionnaires')) return 'questionari';
            if (path.includes('/invalidation')) return 'invalidazione';
            if (path.includes('/technical-support')) return 'supporto';
            if (path.includes('/forum')) return 'forum';
            if (path.includes('/personal-area')) return 'area-personale';
            if (path.includes('/notifications')) return 'notifiche';
        }

        return '';
    }, [location.pathname, role]);

    // Memoize handler to prevent recreation on every render
    const handleSectionSelect = useCallback((section: string) => {
        const basePath = role === 'psychologist' ? '/dashboard' : '/admin-dashboard';

        switch (section) {
            case 'pazienti':
                navigate(`${basePath}/patients`);
                break;
            case 'questionari':
                navigate(`${basePath}/questionnaires`);
                break;
            case 'forum':
                navigate(`${basePath}/forum`);
                break;
            case 'alert':
                navigate(`${basePath}/clinical-alerts`);
                break;
            case 'supporto-tecnico':
                navigate(`${basePath}/technical-support`);
                break;
            case 'area-personale':
                navigate(`${basePath}/personal-area`);
                break;
            case 'psicologi':
                navigate(`${basePath}/psychologists`);
                break;
            case 'invalidazione':
                navigate(`${basePath}/invalidation`);
                break;
            case 'supporto':
                navigate(`${basePath}/technical-support`);
                break;
            case 'notifiche':
                navigate(`${basePath}/notifications`);
                break;
            default:
                navigate(basePath);
        }
    }, [navigate, role]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="app-layout-container">
            {/* Mobile Hamburger Button */}
            <button
                className={`hamburger-btn ${isSidebarOpen ? 'open' : ''}`}
                onClick={toggleSidebar}
                aria-label="Toggle menu"
            >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
            </button>

            <div className="app-layout-grid">
                {/* Fixed Sidebar */}
                <div className={`app-layout-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                    {role === 'admin' ? (
                        <AdminProfile
                            onSelectSection={handleSectionSelect}
                            activeSection={activeSection}
                        />
                    ) : (
                        <PsychologistProfile
                            onSelectSection={handleSectionSelect}
                            activeSection={activeSection}
                        />
                    )}
                </div>

                {/* Dynamic Content Area */}
                <div className="app-layout-content">
                    <Outlet />
                </div>
            </div>

            {/* Global Footer */}
            <footer className="app-footer">
                © 2025 SINTONIA · Gruppo C09
            </footer>
        </div>
    );
};

export default AppLayout;
