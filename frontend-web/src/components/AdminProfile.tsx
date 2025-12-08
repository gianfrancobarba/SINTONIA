/* Profilo amministratore */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth.service';
import profilePhoto from '../images/psychologist-photo.png';
import notificationIcon from '../images/psi-notification.png';
import '../css/PsychologistProfile.css';
import '../css/ClinicalAlerts.css'; // For confirmation overlay styles

// Modern SVG Icons
const PsychologistIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TechSupportIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 19H11V17H13V19ZM15.07 11.25L14.17 12.17C13.45 12.9 13 13.5 13 15H11V14.5C11 13.4 11.45 12.4 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z" fill="currentColor" />
    </svg>
);

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

const InvalidationIcon = () => (
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

const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface AdminProfileProps {
    onSelectSection?: (section: string) => void;
    activeSection?: string | null;
}

const AdminProfile: React.FC<AdminProfileProps> = ({ onSelectSection, activeSection }) => {
    const navigate = useNavigate();
    // Internal state removed - controlled by parent
    const [adminInfo, setAdminInfo] = useState<{ name: string; email: string } | null>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        const fetchAdminData = async () => {
            const user = getCurrentUser();
            if (user && user.email) {
                try {
                    const token = user.access_token;
                    const response = await fetch(`http://localhost:3000/admin/dashboard/me?email=${encodeURIComponent(user.email)}`, {
                        headers: {
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data: { nome: string; cognome: string } = await response.json();
                        setAdminInfo({
                            name: `${data.nome} ${data.cognome}`,
                            email: user.email
                        });
                    } else {
                        // Fallback to email parsing if API fails
                        const name = user.email.split('@')[0];
                        setAdminInfo({
                            name: name.charAt(0).toUpperCase() + name.slice(1),
                            email: user.email
                        });
                    }
                } catch (error) {
                    console.error('Error fetching admin data:', error);
                    // Fallback to email parsing
                    const name = user.email.split('@')[0];
                    setAdminInfo({
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        email: user.email
                    });
                }
            }
        };

        fetchAdminData();
    }, []);

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/login');
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const handleNavigation = (section: string, event: React.MouseEvent) => {
        event.stopPropagation();
        // Just notify parent
        if (onSelectSection) {
            onSelectSection(section);
        }
    };

    const handleBackgroundClick = () => {
        if (onSelectSection) {
            onSelectSection('');
        }
    };

    return (
        <div className="psychologist-profile" onClick={handleBackgroundClick}>
            <div className="profile-header">
                <div className="header-background" />
                <div className="profile-section">
                    <button
                        className="side-btn left-side-btn"
                        aria-label="Edit Profile"
                        onClick={(e) => handleNavigation('area-personale', e)}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="side-btn-icon edit-icon"
                        >
                            <circle cx="12" cy="7" r="4" fill="currentColor" />
                            <path d="M12 14C8.13 14 5 15.79 5 18V20H19V18C19 15.79 15.87 14 12 14Z" fill="currentColor" />
                        </svg>
                    </button>

                    <div className="profile-photo">
                        <img
                            src={profilePhoto}
                            alt={adminInfo?.name || 'Admin'}
                        />
                    </div>

                    <button
                        className="side-btn right-side-btn"
                        aria-label="Notifications"
                        onClick={(e) => handleNavigation('notifiche', e)}
                    >
                        <img src={notificationIcon} alt="Notifications" className="side-btn-icon notification-icon" />
                    </button>
                </div>
            </div>

            <div className="profile-info">
                <h2 className="profile-name">{adminInfo?.name || 'Caricamento...'}</h2>
                <p className="profile-role">Amministratore</p>

                {/* Modern Logout Button */}
                <div className="profile-action-buttons">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                        className="modern-logout-btn"
                    >
                        <LogoutIcon />
                        <span>Esci</span>
                    </button>
                </div>
            </div>

            <div className="navigation-grid">
                <button
                    className={`nav-card ${activeSection === 'psicologi' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('psicologi', e)}
                >
                    <div className="nav-icon"><PsychologistIcon /></div>
                    <span className="nav-label">Psicologi</span>
                </button>

                <button
                    className={`nav-card ${activeSection === 'supporto' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('supporto', e)}
                >
                    <div className="nav-icon"><TechSupportIcon /></div>
                    <span className="nav-label">Supporto Tecnico</span>
                </button>

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
                    className={`nav-card ${activeSection === 'invalidazione' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('invalidazione', e)}
                >
                    <div className="nav-icon"><InvalidationIcon /></div>
                    <span className="nav-label">Richieste</span>
                </button>

                <button
                    className={`nav-card ${activeSection === 'forum' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('forum', e)}
                >
                    <div className="nav-icon"><ForumIcon /></div>
                    <span className="nav-label">Forum</span>
                </button>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && ReactDOM.createPortal(
                <div className="alerts-overlay" role="dialog" aria-modal="true" aria-labelledby="logout-confirm-title">
                    <div className="alerts-overlay-backdrop" onClick={cancelLogout} />
                    <div className="alerts-overlay-card" role="document" onClick={(e) => e.stopPropagation()}>
                        <h3 id="logout-confirm-title" className="overlay-title" style={{ color: '#333' }}>Conferma Uscita</h3>
                        <p className="overlay-text" style={{ color: '#666' }}>
                            Sei sicuro di voler uscire dalla piattaforma?
                        </p>
                        <div className="overlay-actions">
                            <button className="cancel-btn" onClick={(e) => { e.stopPropagation(); cancelLogout(); }}>
                                Annulla
                            </button>
                            <button
                                className="confirm-btn"
                                onClick={(e) => { e.stopPropagation(); confirmLogout(); }}
                                style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%)' }}
                            >
                                Esci
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div >
    );
};

export default AdminProfile;
