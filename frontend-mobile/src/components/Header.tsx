import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { HomeDashboardDto } from '../types/home';
import '../css/Header.css';
import questionnaireIcon from '../assets/icons/questionnaire.svg';
import calendarIcon from '../assets/icons/calendar.svg';
import profileAvatarWoman from '../assets/images/profile-avatar-woman.png';
import profileAvatarMan from '../assets/images/profile-avatar-man.png';
import MoodIcon from './MoodIcons';
import type { Umore } from '../types/mood';

interface HeaderProps {
    data: HomeDashboardDto;
}

const Header: React.FC<HeaderProps> = ({ data }) => {
    const navigate = useNavigate();

    // Select avatar based on gender
    const profileAvatar = data.gender === 'F' ? profileAvatarWoman : profileAvatarMan;

    // Generate current date in Italian format
    const getCurrentDate = () => {
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        };
        return today.toLocaleDateString('it-IT', options);
    };

    const handleMoodClick = () => {
        navigate('/mood-entry');
    };

    const handleNotificationClick = () => {
        navigate('/questionari');
    };

    return (
        <header className="header">
            <div className="header-top">
                <div className="date-display">
                    <img src={calendarIcon} alt="Calendar" className="calendar-icon" />
                    <span>{getCurrentDate()}</span>
                </div>
                <div className="status-bar-placeholder">
                    {/* Status bar area handled by OS/Device, but we leave space if needed */}
                </div>
            </div>

            <div className="user-section">
                <div className="user-info">
                    <div className="avatar">
                        <img src={profileAvatar} alt="Avatar" />
                    </div>
                    <div className="greeting-text">
                        <h1>Ciao, {data.firstName}!</h1>
                        <div className="mood-badge" onClick={handleMoodClick} style={{ cursor: 'pointer' }}>
                            <MoodIcon mood={data.mood as Umore} size={24} />
                            <span>{data.mood}</span>
                        </div>
                    </div>
                </div>

                <div className="notification-icon" onClick={handleNotificationClick}>
                    <div className="icon-box">
                        <img src={questionnaireIcon} alt="Questionnaires" />
                    </div>
                    {data.notificationsCount > 0 && (
                        <span className="badge">+{data.notificationsCount}</span>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
