import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MessageCircle, LogOut, ChevronRight } from 'lucide-react';
import { logout } from '../services/spid-auth.service';
import LeftArrowIcon from '../assets/icons/LeftArrow.svg';
import '../css/Settings.css';

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleBack = () => {
        navigate('/profile');
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = () => {
        logout();
        navigate('/spid-info');
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    const handlePersonalInfo = () => {
        navigate('/settings/personal-info');
    };

    const handleSupport = () => {
        navigate('/settings/support');
    };

    return (
        <div className="settings-page">
            {/* Header */}
            <div className="settings-header">
                <div className="header-content">
                    <button className="settings-back-btn" onClick={handleBack} aria-label="Indietro">
                        <img src={LeftArrowIcon} alt="Back" />
                    </button>
                    <h1 className="settings-title">Impostazioni</h1>
                </div>
            </div>

            <div className="settings-content">
                {/* General Settings Section */}
                <div className="settings-section">
                    <h3 className="settings-section-title">Impostazioni Generali</h3>

                    <button className="settings-item" onClick={handlePersonalInfo}>
                        <div className="settings-item-left">
                            <User size={20} className="settings-item-icon" />
                            <span className="settings-item-text">Informazioni Personali</span>
                        </div>
                        <ChevronRight size={20} className="settings-item-arrow" />
                    </button>

                    <button className="settings-item" onClick={handleSupport}>
                        <div className="settings-item-left">
                            <MessageCircle size={20} className="settings-item-icon" />
                            <span className="settings-item-text">Richiesta Supporto Tecnico</span>
                        </div>
                        <ChevronRight size={20} className="settings-item-arrow" />
                    </button>
                </div>

                {/* Logout Section */}
                <div className="settings-section">
                    <h3 className="settings-section-title">Disconnessione</h3>

                    <button className="settings-item settings-item-logout" onClick={handleLogoutClick}>
                        <div className="settings-item-left">
                            <LogOut size={20} className="settings-item-icon" />
                            <span className="settings-item-text">Esci</span>
                        </div>
                        <ChevronRight size={20} className="settings-item-arrow" />
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="modal-overlay" onClick={handleLogoutCancel}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Conferma Uscita</h2>
                        <p className="modal-message">Sei sicuro di voler uscire?</p>
                        <div className="modal-buttons">
                            <button className="modal-button modal-button-cancel" onClick={handleLogoutCancel}>
                                Annulla
                            </button>
                            <button className="modal-button modal-button-confirm" onClick={handleLogoutConfirm}>
                                Esci
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
