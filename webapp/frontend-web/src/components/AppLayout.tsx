import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import PsychologistProfile from './PsychologistProfile';
import AdminProfile from './AdminProfile';
import MobileDrawerMenu from './MobileDrawerMenu';
import { getCurrentUser } from '../services/auth.service';
import { fetchDashboardData } from '../services/psychologist.service';
import '../css/AppLayout.css';

interface AppLayoutProps {
    role: 'psychologist' | 'admin';
}

// Context type for Outlet
export interface OutletContextType {
    onProfileUpdate: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ role }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [profileRefreshKey, setProfileRefreshKey] = useState(0);
    const [userData, setUserData] = useState<{ name: string; profileImageUrl?: string }>({ name: '' });

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

    // Fetch user data for mobile menu
    useEffect(() => {
        const loadUserData = async () => {
            const user = getCurrentUser();
            if (!user) return;

            if (role === 'psychologist') {
                try {
                    const cf = user.fiscalCode || user.email;
                    if (cf) {
                        const data = await fetchDashboardData(cf);
                        setUserData({
                            name: data.fullName,
                            profileImageUrl: data.profileImageUrl
                        });
                    }
                } catch (error) {
                    console.error('Error fetching psychologist data:', error);
                }
            } else {
                try {
                    const token = user.access_token;
                    const response = await fetch(`http://localhost:3000/admin/dashboard/me?email=${encodeURIComponent(user.email)}`, {
                        headers: {
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUserData({ name: `${data.nome} ${data.cognome}` });
                    } else {
                        const name = user.email.split('@')[0];
                        setUserData({ name: name.charAt(0).toUpperCase() + name.slice(1) });
                    }
                } catch (error) {
                    console.error('Error fetching admin data:', error);
                }
            }
        };

        loadUserData();
    }, [role, profileRefreshKey]);

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

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Callback to trigger profile refresh in sidebar
    const handleProfileUpdate = useCallback(() => {
        setProfileRefreshKey(prev => prev + 1);
    }, []);

    // Context to pass to Outlet children
    const outletContext: OutletContextType = useMemo(() => ({
        onProfileUpdate: handleProfileUpdate
    }), [handleProfileUpdate]);

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

            {/* Mobile Drawer Menu */}
            <MobileDrawerMenu
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                role={role}
                activeSection={activeSection}
                onSelectSection={handleSectionSelect}
                userName={userData.name}
                profileImageUrl={userData.profileImageUrl}
            />

            <div className="app-layout-grid">
                {/* Desktop Sidebar - Hidden on mobile */}
                <div className="app-layout-sidebar">
                    {role === 'admin' ? (
                        <AdminProfile
                            onSelectSection={handleSectionSelect}
                            activeSection={activeSection}
                            refreshKey={profileRefreshKey}
                        />
                    ) : (
                        <PsychologistProfile
                            onSelectSection={handleSectionSelect}
                            activeSection={activeSection}
                            refreshKey={profileRefreshKey}
                        />
                    )}
                </div>

                {/* Dynamic Content Area */}
                <div className="app-layout-content">
                    <Outlet context={outletContext} />
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


