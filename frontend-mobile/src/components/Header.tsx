import React from 'react';
import type { HomeDashboardDto } from '../types/home';
import '../css/Header.css';
import notificationIcon from '../assets/icons/notification.svg';

interface HeaderProps {
    data: HomeDashboardDto;
}

const Header: React.FC<HeaderProps> = ({ data }) => {
    return (
        <header className="header">
            <div className="header-top">
                <div className="date-display">
                    <span className="calendar-icon">📅</span>
                    <span>Gio, 15 Dic 2025</span> {/* Hardcoded for design match, or use real date */}
                </div>
                <div className="status-bar-placeholder">
                    {/* Status bar area handled by OS/Device, but we leave space if needed */}
                </div>
            </div>

            <div className="user-section">
                <div className="user-info">
                    <div className="avatar">
                        <img src="/src/assets/images/avatar-placeholder.png" alt="Avatar" />
                    </div>
                    <div className="greeting-text">
                        <h1>Ciao, {data.firstName}!</h1>
                        <div className="mood-badge">
                            <span className="mood-icon">🙂</span>
                            <span>{data.mood}</span>
                        </div>
                    </div>
                </div>

                <div className="notification-icon">
                    <div className="icon-box">
                        <img src={notificationIcon} alt="Notifications" />
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
