/* Profilo psicologo */

import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../services/psychologist.service';
import { getCurrentUser } from '../services/auth.service';
import type { PsychologistDashboardData, LoadingState } from '../types/psychologist';
import profilePhoto from '../images/psychologist-photo.png';
import notificationIcon from '../images/psi-notification.png';
import editIcon from '../images/psi-edit_profile.png';
import patientIcon from '../images/paziente-list.png';
import questionnaireIcon from '../images/questionari.png';
import alertIcon from '../images/alert-clinico.png';
import forumIcon from '../images/forum.png';
import '../css/PsychologistProfile.css';

const PsychologistProfile: React.FC = () => {
    const [dashboardState, setDashboardState] = useState<LoadingState<PsychologistDashboardData>>({
        data: null,
        loading: true,
        error: null,
    });
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setDashboardState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const user = getCurrentUser();
            const cf = user?.fiscalCode || user?.email; // Fallback or use specific field
            // Note: backend expects 'cf' query param. 
            // If user is logged in via SPID, fiscalCode should be in the token/user object.
            // If logged in via standard login, it might be email or we need to fetch profile first.

            const data = await fetchDashboardData(cf || undefined);
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
        console.log('Navigate to:', section);
        setSelectedSection(section);
    };

    const handleBackgroundClick = () => {
        setSelectedSection(null);
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

    const { fullName, profileImageUrl, role, alertsCount, pendingQuestionnairesCount, unreadMessagesCount } = dashboardState.data;

    return (
        <div className="psychologist-profile" onClick={handleBackgroundClick}>
            <div className="profile-header">
                <div className="header-background" />
                <div className="profile-section">
                    <button className="side-btn left-side-btn" aria-label="Edit Profile">
                        <img src={editIcon} alt="Edit" className="side-btn-icon edit-icon" />
                    </button>

                    <div className="profile-photo">
                        <img
                            src={profileImageUrl || profilePhoto}
                            alt={fullName}
                            onError={(e) => {
                                e.currentTarget.src = profilePhoto;
                            }}
                        />
                    </div>

                    <button className="side-btn right-side-btn" aria-label="Notifications">
                        <img src={notificationIcon} alt="Notifications" className="side-btn-icon notification-icon" />
                    </button>
                </div>
            </div>

            <div className="profile-info">
                <h2 className="profile-name">{fullName}</h2>
                <p className="profile-role">{role}</p>
            </div>

            <div className="navigation-grid">
                <button
                    className={`nav-card ${selectedSection === 'pazienti' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('pazienti', e)}
                >
                    <img src={patientIcon} alt="" className="nav-icon-img patient-icon" />
                    <span className="nav-label">Pazienti</span>
                </button>

                <button
                    className={`nav-card ${selectedSection === 'questionari' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('questionari', e)}
                >
                    <img src={questionnaireIcon} alt="" className="nav-icon-img" />
                    <span className="nav-label">Questionari</span>
                    {pendingQuestionnairesCount > 0 && (
                        <span className="notification-badge">{pendingQuestionnairesCount}</span>
                    )}
                </button>

                <button
                    className={`nav-card ${selectedSection === 'alert' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('alert', e)}
                >
                    <img src={alertIcon} alt="" className="nav-icon-img" />
                    <span className="nav-label">Alert Clinici</span>
                    {alertsCount > 0 && (
                        <span className="notification-badge">{alertsCount}</span>
                    )}
                </button>

                <button
                    className={`nav-card ${selectedSection === 'forum' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('forum', e)}
                >
                    <img src={forumIcon} alt="" className="nav-icon-img" />
                    <span className="nav-label">Forum</span>
                    {unreadMessagesCount > 0 && (
                        <span className="notification-badge">{unreadMessagesCount}</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PsychologistProfile;

