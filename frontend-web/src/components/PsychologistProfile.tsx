/* Profilo psicologo */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../services/psychologist.service';
import { getCurrentUser, logout } from '../services/auth.service';
import type { PsychologistDashboardData, LoadingState } from '../types/psychologist';
import profilePhoto from '../images/psychologist-photo.png';
import notificationIcon from '../images/psi-notification.png';
import '../css/PsychologistProfile.css';

// Modern SVG Icons
const PatientIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor" />
    </svg>
);

const QuestionnaireIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const AlertIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const ForumIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 9H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 13H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const SupportIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface PsychologistProfileProps {
    onSelectSection?: (section: string) => void;
    activeSection?: string | null;
}

const PsychologistProfile: React.FC<PsychologistProfileProps> = ({ onSelectSection, activeSection }) => {
    const navigate = useNavigate();
    // Internal state and location logic removed - completely controlled by parent
    const [dashboardState, setDashboardState] = useState<LoadingState<PsychologistDashboardData>>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setDashboardState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const user = getCurrentUser();
            const cf = user?.fiscalCode || user?.email;

            if (!cf) {
                throw new Error('Codice Fiscale non trovato nel profilo utente');
            }

            const data = await fetchDashboardData(cf);
            setDashboardState({ data, loading: false, error: null });
        } catch (error) {
            setDashboardState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to load dashboard data',
            });
        }
    };

    const handleNavigation = (section: string, event: React.MouseEvent) => {
        event.stopPropagation();
        // Just notify parent, do not navigate internally
        if (onSelectSection) {
            onSelectSection(section);
        }
    };

    const handleBackgroundClick = () => {
        // Optional: notify parent to clear selection if needed
        if (onSelectSection) {
            onSelectSection('');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Show loading state
    if (dashboardState.loading) {
        return (
            <div className="psychologist-profile">
                <div className="profile-loading">Loading...</div>
            </div>
        );
    }

    // Show error state
    if (dashboardState.error) {
        return (
            <div className="psychologist-profile">
                <div className="profile-error">
                    <p>Errore nel caricamento dei dati</p>
                    <button onClick={loadDashboardData} className="retry-button">
                        Riprova
                    </button>
                </div>
            </div>
        );
    }

    // No data available
    if (!dashboardState.data) {
        return null;
    }

    const { fullName, profileImageUrl, role } = dashboardState.data;

    return (
        <div className="psychologist-profile" onClick={handleBackgroundClick}>
            <div className="profile-header">
                <div className="header-background" />
                <div className="profile-section">
                    {/* Left icon - Area Personale */}
                    <button
                        className="side-btn left-side-btn"
                        aria-label="Area Personale"
                        onClick={(e) => handleNavigation('area-personale', e)}
                        title="Area Personale"
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="12" cy="7" r="4" fill="currentColor" />
                            <path d="M12 14C8.13 14 5 15.79 5 18V20H19V18C19 15.79 15.87 14 12 14Z" fill="currentColor" />
                        </svg>
                    </button>

                    {/* Profile Photo */}
                    <div className="profile-photo">
                        <img
                            src={
                                profileImageUrl && !profileImageUrl.startsWith('http')
                                    ? `http://localhost:3000/uploads/${profileImageUrl}`
                                    : profileImageUrl || profilePhoto
                            }
                            alt={fullName}
                            onError={(e) => {
                                e.currentTarget.src = profilePhoto;
                            }}
                        />
                    </div>

                    {/* Right icon - Notifiche */}
                    <button
                        className="side-btn right-side-btn"
                        aria-label="Notifiche"
                        onClick={(e) => handleNavigation('notifiche', e)}
                        title="Notifiche"
                    >
                        <img src={notificationIcon} alt="Notifications" className="side-btn-icon notification-icon" />
                    </button>
                </div>
            </div>

            <div className="profile-info">
                <h2 className="profile-name">{fullName}</h2>
                <p className="profile-role">{role}</p>

                {/* Action buttons row */}
                <div className="profile-action-buttons">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleNavigation('supporto-tecnico', e); }}
                        className="support-link-btn"
                    >
                        <SupportIcon />
                        <span>Supporto</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                        className="modern-logout-btn"
                    >
                        <LogoutIcon />
                        <span>Esci</span>
                    </button>
                </div>
            </div>

            <div className="navigation-grid navigation-grid-2col">
                <button
                    className={`nav-card ${activeSection === 'pazienti' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('pazienti', e)}
                >
                    <div className="nav-icon"><PatientIcon /></div>
                    <span className="nav-label">Pazienti</span>
                </button>

                <button
                    className={`nav-card ${activeSection === 'questionari' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('questionari', e)}
                >
                    <div className="nav-icon"><QuestionnaireIcon /></div>
                    <span className="nav-label">Questionari</span>
                </button>

                <button
                    className={`nav-card ${activeSection === 'alert' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('alert', e)}
                >
                    <div className="nav-icon"><AlertIcon /></div>
                    <span className="nav-label">Alert Clinici</span>
                </button>

                <button
                    className={`nav-card ${activeSection === 'forum' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('forum', e)}
                >
                    <div className="nav-icon"><ForumIcon /></div>
                    <span className="nav-label">Forum</span>
                </button>
            </div>
        </div>
    );
};

export default PsychologistProfile;
