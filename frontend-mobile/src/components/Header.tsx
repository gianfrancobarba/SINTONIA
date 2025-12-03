import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { HomeDashboardDto } from '../types/home';
import '../css/Header.css';
import questionnaireIcon from '../assets/icons/questionnaire.svg';
import calendarIcon from '../assets/icons/calendar.svg';
import moodHappy from '../assets/icons/mood-happy.svg';
import moodOverjoyed from '../assets/icons/mood-overjoyed.svg';
import moodNeutral from '../assets/icons/mood-neutral.svg';
import moodSad from '../assets/icons/mood-sad.svg';
import moodDepressed from '../assets/icons/mood-depressed.svg';
import profileAvatar from '../assets/images/profile-avatar.png';

interface HeaderProps {
    data: HomeDashboardDto;
}

const Header: React.FC<HeaderProps> = ({ data }) => {
    const navigate = useNavigate();

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

    // Map mood to appropriate icon
    const getMoodIcon = () => {
        const mood = data.mood?.toLowerCase();
        if (!mood) return moodNeutral;

        if (mood.includes('felice') || mood.includes('calmo') || mood.includes('speranzoso')) {
            return mood.includes('speranzoso') || mood.includes('calmo') ? moodHappy : moodOverjoyed;
        } else if (mood.includes('triste') || mood.includes('apatico')) {
            return moodSad;
        } else if (mood.includes('panico') || mood.includes('ansia') || mood.includes('agitato') || mood.includes('rabbia') || mood.includes('irritabile') || mood.includes('stanco')) {
            return moodDepressed;
        }
        return moodNeutral;
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
                        <div className="mood-badge">
                            <img src={getMoodIcon()} alt={data.mood} className="mood-icon" />
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
