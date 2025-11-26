/* Profilo psicologo */

import React, { useState } from 'react';
import { getPsychologistInfo } from '../services/psychologist.service';
import profilePhoto from '../images/psychologist-photo.png';
import notificationIcon from '../images/psi-notification.png';
import editIcon from '../images/psi-edit_profile.png';
import patientIcon from '../images/paziente-list.png';
import questionnaireIcon from '../images/questionari.png';
import alertIcon from '../images/alert-clinico.png';
import forumIcon from '../images/forum.png';
import './PsychologistProfile.css';

const PsychologistProfile: React.FC = () => {
    const psychologist = getPsychologistInfo();
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    const handleNavigation = (section: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent deselection when clicking button
        console.log('Navigate to:', section);
        setSelectedSection(section);
        // Placeholder - will be implemented in future
    };

    const handleBackgroundClick = () => {
        setSelectedSection(null); // Deselect when clicking outside
    };

    return (
        <div className="psychologist-profile" onClick={handleBackgroundClick}>
            <div className="profile-header">
                <div className="header-background" />
                <div className="profile-section">
                    <button className="side-btn left-side-btn" aria-label="Edit Profile">
                        <img src={editIcon} alt="Edit" className="side-btn-icon edit-icon" />
                    </button>

                    <div className="profile-photo">
                        <img src={profilePhoto} alt={psychologist.name} />
                    </div>

                    <button className="side-btn right-side-btn" aria-label="Notifications">
                        <img src={notificationIcon} alt="Notifications" className="side-btn-icon notification-icon" />
                    </button>
                </div>
            </div>

            <div className="profile-info">
                <h2 className="profile-name">{psychologist.name}</h2>
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
                </button>

                <button
                    className={`nav-card ${selectedSection === 'alert' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('alert', e)}
                >
                    <img src={alertIcon} alt="" className="nav-icon-img" />
                    <span className="nav-label">Alert Clinici</span>
                </button>

                <button
                    className={`nav-card ${selectedSection === 'forum' ? 'selected' : ''}`}
                    onClick={(e) => handleNavigation('forum', e)}
                >
                    <img src={forumIcon} alt="" className="nav-icon-img" />
                    <span className="nav-label">Forum</span>
                </button>
            </div>
        </div>
    );
};

export default PsychologistProfile;
