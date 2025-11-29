import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MessageCircle, Award, LogOut, ChevronRight } from 'lucide-react';
import { getProfileData } from '../services/profile.service';
import {getCurrentPatient, logout} from '../services/spid-auth.service';
import type { ProfileDto } from '../types/profile';
import BottomNavigation from '../components/BottomNavigation';
import LeftArrowIcon from '../assets/icons/LeftArrow.svg';
import '../css/Settings.css';

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<ProfileDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProfileData();
                setProfileData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleBack = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
        logout();
        navigate('/spid-info');
    };

    const handlePersonalInfo = () => {
        // TODO: Navigate to personal info page
        console.log('Navigate to personal info');
    };

    const handleSupport = () => {
        // TODO: Navigate to support page
        console.log('Navigate to support');
    };

    const handleBadges = () => {
        // TODO: Navigate to badges page
        console.log('Navigate to badges');
    };

    if (loading) {
        return (
            <div className="settings-page">
                <div className="settings-loading">Caricamento...</div>
            </div>
        );
    }

    const userName = profileData?.profilo?.nome || 'Utente';
    const userSurname = profileData?.profilo?.cognome || '';
    const currentUser = getCurrentPatient();
    const userEmail = currentUser?.email || '';

    return (
        <div className="settings-page">
            {/* Header */}
            <div className="settings-header">
                <button className="settings-back-btn" onClick={handleBack} aria-label="Indietro">
                    <img src={LeftArrowIcon} alt="Back" />
                </button>
                <h1 className="settings-title">Impostazioni</h1>
            </div>

            {/* Curved Background */}
            <div className="settings-background"></div>

            {/* Profile Section */}
            <div className="settings-profile-section">
                <div className="settings-avatar-circle">
                    <div className="settings-avatar-placeholder">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="35" r="18" fill="#4A5568" />
                            <path d="M 20 80 Q 20 55 50 55 Q 80 55 80 80" fill="#4A5568" />
                        </svg>
                    </div>
                </div>
                <h2 className="settings-user-name">{userName} {userSurname}</h2>
                {userEmail && <p className="settings-user-email">{userEmail}</p>}
            </div>

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

                <button className="settings-item" onClick={handleBadges}>
                    <div className="settings-item-left">
                        <Award size={20} className="settings-item-icon" />
                        <span className="settings-item-text">I Tuoi Badge</span>
                    </div>
                    <ChevronRight size={20} className="settings-item-arrow" />
                </button>
            </div>

            {/* Logout Section */}
            <div className="settings-section">
                <h3 className="settings-section-title">Disconnessione</h3>

                <button className="settings-item" onClick={handleLogout}>
                    <div className="settings-item-left">
                        <LogOut size={20} className="settings-item-icon" />
                        <span className="settings-item-text">Esci</span>
                    </div>
                    <ChevronRight size={20} className="settings-item-arrow" />
                </button>
            </div>

            <BottomNavigation />
        </div>
    );
};

export default Settings;
