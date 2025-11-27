import React, { useState, useEffect } from 'react';
import { fetchAdministratorInfo } from '../services/adminDashboard.service';
import type { AdminInfo } from '../types/adminDashboard.types';
import profilePhoto from '../icons/profile_picture.svg';
import psychologistIcon from '../icons/psychologist_icon.svg';
import notificationIcon from '../icons/notification_icon.svg';
import editIcon from '../icons/edit_icon.svg';
import patientIcon from '../icons/pazienti_icon.svg';
import questionnaireIcon from '../icons/questionario_icon.svg';
import forumIcon from '../icons/forum_icon.svg';

import supportoIcon from '../icons/supporto_icon.svg';
import invalidazioneIcon from '../icons/invalidazione_icon.svg';
import './AdminProfileCard.css';

interface AdminProfileCardProps {
    selectedSection: string | null;
    onSelectSection: (section: string) => void;
    adminEmail: string;
}

const AdminProfileCard: React.FC<AdminProfileCardProps> = ({ selectedSection, onSelectSection, adminEmail }) => {
    const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchAdministratorInfo(adminEmail);
                setAdminInfo(data);
                setError(null);
            } catch (err) {
                console.error('Errore caricamento admin:', err);
                setError('Errore caricamento dati');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [adminEmail]);

    const handleNavigation = (section: string, event: React.MouseEvent) => {
        event.stopPropagation();
        onSelectSection(section);
    };

    return (
        <div className="psychologist-profile">
            <div className="profile-header-container">
                <div className="header-curve"></div>
                <div className="header-content">
                    <button className="icon-btn left-btn" aria-label="Edit Profile">
                        <img src={editIcon} alt="Edit" />
                    </button>

                    <div className="profile-photo-container">
                        <img src={profilePhoto} alt="Admin" className="profile-img" />
                    </div>

                    <button className="icon-btn right-btn" aria-label="Notifications">
                        <img src={notificationIcon} alt="Notifications" />
                    </button>
                </div>
                <h2 className="profile-name">
                    {loading && 'Caricamento...'}
                    {error && error}
                    {adminInfo && `${adminInfo.nome} ${adminInfo.cognome}`}
                </h2>
            </div>

            <div className="navigation-grid">
                <button
                    className={`nav-card ${selectedSection === 'psicologi' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('psicologi', e)}
                >
                    <div className="nav-icon-container">
                        <img src={psychologistIcon} alt="" className="nav-icon-img mix-blend" />
                    </div>
                    <span className="nav-label">Psicologi</span>
                </button>

                <button
                    className={`nav-card ${selectedSection === 'supporto' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('supporto', e)}
                >
                    <div className="nav-icon-container">
                        <img src={supportoIcon} alt="" className="nav-icon-img" />
                    </div>
                    <span className="nav-label">Supporto Tecnico</span>
                </button>

                <button
                    className={`nav-card ${selectedSection === 'pazienti' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('pazienti', e)}
                >
                    <div className="nav-icon-container">
                        <img src={patientIcon} alt="" className="nav-icon-img" />
                    </div>
                    <span className="nav-label">Pazienti</span>
                </button>

                <button
                    className={`nav-card ${selectedSection === 'questionari' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('questionari', e)}
                >
                    <div className="nav-icon-container">
                        <img src={questionnaireIcon} alt="" className="nav-icon-img" />
                    </div>
                    <span className="nav-label">Questionari</span>
                </button>

                <button
                    className={`nav-card ${selectedSection === 'richieste' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('richieste', e)}
                >
                    <div className="nav-icon-container">
                        <img src={invalidazioneIcon} alt="" className="nav-icon-img" />
                    </div>
                    <span className="nav-label">Richieste Invalidazione</span>
                </button>

                <button
                    className={`nav-card ${selectedSection === 'forum' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('forum', e)}
                >
                    <div className="nav-icon-container">
                        <img src={forumIcon} alt="" className="nav-icon-img" />
                    </div>
                    <span className="nav-label">Forum</span>
                </button>
            </div>
        </div>
    );
};

export default AdminProfileCard;
