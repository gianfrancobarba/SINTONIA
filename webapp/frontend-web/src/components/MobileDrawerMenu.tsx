import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/auth.service';
import profilePhoto from '../images/psychologist-photo.png';
import '../css/MobileDrawerMenu.css';

// SVG Icons
const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface MobileDrawerMenuProps {
    isOpen: boolean;
    onClose: () => void;
    role: 'psychologist' | 'admin';
    activeSection: string;
    onSelectSection: (section: string) => void;
    userName?: string;
    profileImageUrl?: string;
}

// Psychologist menu items
const psychologistMenuItems: MenuItem[] = [
    { id: 'pazienti', label: 'Pazienti', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor" /></svg> },
    { id: 'questionari', label: 'Questionari', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> },
    { id: 'alert', label: 'Alert Clinici', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="16" r="1" fill="currentColor" /></svg> },
    { id: 'forum', label: 'Forum', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 9H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M7 13H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> },
    { id: 'supporto-tecnico', label: 'Supporto Tecnico', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="17" r="1" fill="currentColor" /></svg> },
    { id: 'area-personale', label: 'Area Personale', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7" r="4" fill="currentColor" /><path d="M12 14C8.13 14 5 15.79 5 18V20H19V18C19 15.79 15.87 14 12 14Z" fill="currentColor" /></svg> },
    { id: 'notifiche', label: 'Notifiche', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
];

// Admin menu items
const adminMenuItems: MenuItem[] = [
    { id: 'psicologi', label: 'Psicologi', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { id: 'pazienti', label: 'Pazienti', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor" /></svg> },
    { id: 'questionari', label: 'Questionari', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> },
    { id: 'invalidazione', label: 'Richieste', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="16" r="1" fill="currentColor" /></svg> },
    { id: 'supporto', label: 'Supporto Tecnico', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="17" r="1" fill="currentColor" /></svg> },
    { id: 'forum', label: 'Forum', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 9H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M7 13H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> },
    { id: 'area-personale', label: 'Area Personale', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7" r="4" fill="currentColor" /><path d="M12 14C8.13 14 5 15.79 5 18V20H19V18C19 15.79 15.87 14 12 14Z" fill="currentColor" /></svg> },
    { id: 'notifiche', label: 'Notifiche', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
];

const MobileDrawerMenu: React.FC<MobileDrawerMenuProps> = ({
    isOpen,
    onClose,
    role,
    activeSection,
    onSelectSection,
    userName,
    profileImageUrl,
}) => {
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const menuItems = role === 'admin' ? adminMenuItems : psychologistMenuItems;
    const displayName = userName || 'Utente';
    const roleLabel = role === 'admin' ? 'Amministratore' : 'Psicologo';

    const handleMenuClick = (sectionId: string) => {
        onSelectSection(sectionId);
        onClose();
    };

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

    const imgSrc = profileImageUrl
        ? profileImageUrl.startsWith('data:') || profileImageUrl.startsWith('http')
            ? profileImageUrl
            : `http://localhost:3000/uploads/${profileImageUrl}`
        : profilePhoto;

    if (!isOpen && !showLogoutConfirm) return null;

    return ReactDOM.createPortal(
        <>
            {/* Drawer */}
            <div className={`mobile-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="mobile-drawer-header">
                    <div className="mobile-drawer-profile">
                        <img
                            src={imgSrc}
                            alt={displayName}
                            className="mobile-drawer-avatar"
                            onError={(e) => { e.currentTarget.src = profilePhoto; }}
                        />
                        <div className="mobile-drawer-info">
                            <span className="mobile-drawer-name">{displayName}</span>
                            <span className="mobile-drawer-role">{roleLabel}</span>
                        </div>
                    </div>
                    <button className="mobile-drawer-close" onClick={onClose} aria-label="Chiudi menu">
                        <CloseIcon />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mobile-drawer-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={`mobile-drawer-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => handleMenuClick(item.id)}
                        >
                            <span className="mobile-drawer-item-icon">{item.icon}</span>
                            <span className="mobile-drawer-item-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Footer with Logout */}
                <div className="mobile-drawer-footer">
                    <button className="mobile-drawer-logout" onClick={handleLogout}>
                        <LogoutIcon />
                        <span>Esci</span>
                    </button>
                </div>
            </div>

            {/* Logout Confirmation */}
            {showLogoutConfirm && (
                <div className="mobile-drawer-confirm-overlay">
                    <div className="mobile-drawer-confirm-backdrop" onClick={cancelLogout} />
                    <div className="mobile-drawer-confirm-card">
                        <h3>Conferma Uscita</h3>
                        <p>Sei sicuro di voler uscire dalla piattaforma?</p>
                        <div className="mobile-drawer-confirm-actions">
                            <button className="mobile-drawer-confirm-cancel" onClick={cancelLogout}>
                                Annulla
                            </button>
                            <button className="mobile-drawer-confirm-logout" onClick={confirmLogout}>
                                Esci
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>,
        document.body
    );
};

export default MobileDrawerMenu;
