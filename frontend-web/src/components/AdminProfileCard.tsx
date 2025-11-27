import React from 'react';
import { getAdministratorInfo } from '../services/adminDashboard.service';
import profilePhoto from '../icons/profile_picture.svg';
import psychologistIcon from '../icons/pazienti_icon.svg';
import notificationIcon from '../icons/notification_icon.svg';
import editIcon from '../icons/edit_icon.svg';
import patientIcon from '../icons/pazienti_icon.svg';
import questionnaireIcon from '../icons/questionario_icon.svg';
import forumIcon from '../icons/forum_icon.svg';
import alertIcon from '../icons/alert_icon.svg';
import './AdminProfileCard.css';

interface AdminProfileCardProps {
    selectedSection: string | null;
    onSelectSection: (section: string) => void;
}

const AdminProfileCard: React.FC<AdminProfileCardProps> = ({ selectedSection, onSelectSection }) => {
    const administrator = getAdministratorInfo();

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
                        <img src={profilePhoto} alt={administrator.name} className="profile-img" />
                    </div>

                    <button className="icon-btn right-btn" aria-label="Notifications">
                        <img src={notificationIcon} alt="Notifications" />
                    </button>
                </div>
                <h2 className="profile-name">{administrator.name}</h2>
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
                        <img src={alertIcon} alt="" className="nav-icon-img" />
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
                        <img src={alertIcon} alt="" className="nav-icon-img" />
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
