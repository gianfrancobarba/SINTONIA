import React from 'react';
import '../css/BottomNavigation.css';
import usersIcon from '../assets/icons/users.svg';
import noteIcon from '../assets/icons/note.svg';
import homeIcon from '../assets/icons/home.svg';
import bellIcon from '../assets/icons/bell.svg';
import userIcon from '../assets/icons/user.svg';

const BottomNavigation: React.FC = () => {
    return (
        <div className="bottom-nav-container">
            <div className="bottom-nav-background">
                <svg viewBox="0 0 375 90" preserveAspectRatio="none" className="nav-curve">
                    <path d="M0,90 L0,25 C0,25 70,25 110,25 C150,25 155,0 187.5,0 C220,0 225,25 265,25 C305,25 375,25 375,25 L375,90 Z" fill="white" />
                </svg>
            </div>

            <div className="nav-items">
                {/* Users / Community Icon */}
                <button className="nav-item">
                    <img src={usersIcon} alt="Community" />
                </button>

                {/* Document / Note Icon */}
                <button className="nav-item">
                    <img src={noteIcon} alt="Notes" />
                </button>

                <div className="fab-container">
                    <button className="fab">
                        <img src={homeIcon} alt="Home" />
                    </button>
                </div>

                {/* Bell / Notifications Icon */}
                <button className="nav-item">
                    <img src={bellIcon} alt="Notifications" />
                </button>

                {/* User / Profile Icon */}
                <button className="nav-item">
                    <img src={userIcon} alt="Profile" />
                </button>
            </div>


        </div>
    );
};

export default BottomNavigation;
