import React, { useMemo, useCallback } from 'react';
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

    // Memoize active section calculation to prevent unnecessary re-renders
    const activeSection = useMemo(() => {
        const path = location.pathname;

        if (role === 'psychologist') {
            if (path.includes('/patients')) return 'pazienti';
            if (path.includes('/questionnaires')) return 'questionari';
            if (path.includes('/forum')) return 'forum';
            if (path.includes('/clinical-alerts')) return 'alert';
            if (path.includes('/personal-area')) return 'area-personale';
        } else {
            if (path.includes('/patients')) return 'pazienti';
            if (path.includes('/psychologists')) return 'psicologi';
            if (path.includes('/questionnaires')) return 'questionari';
            if (path.includes('/invalidation')) return 'invalidazione';
            if (path.includes('/forum')) return 'forum';
            if (path.includes('/personal-area')) return 'area-personale';
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
            case 'area-personale':
                navigate(`${basePath}/personal-area`);
                break;
            case 'psicologi':
                navigate(`${basePath}/psychologists`);
                break;
            case 'invalidazione':
                navigate(`${basePath}/invalidation`);
                break;
            default:
                navigate(basePath);
        }
    }, [navigate, role]);

    return (
        <div className="app-layout-container">
            <div className="app-layout-grid">
                {/* Fixed Sidebar */}
                <div className="app-layout-sidebar">
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
        </div>
    );
};

export default AppLayout;
