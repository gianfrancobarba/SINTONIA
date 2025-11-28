import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentPatient, logout } from '../services/spid-auth.service';
import BottomNavigation from '../components/BottomNavigation';
import '../css/Profile.css';

// Logout SVG Icon
const LogoutIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const patient = getCurrentPatient();

    const handleLogout = () => {
        logout();
        navigate('/spid-info');
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>Profilo</h1>
            </div>

            <div className="profile-content">
                {patient && (
                    <div className="user-info-card">
                        <h2>{patient.firstName} {patient.lastName}</h2>
                        <p className="user-fiscal-code">{patient.fiscalCode}</p>
                    </div>
                )}

                <button onClick={handleLogout} className="logout-button">
                    <LogoutIcon />
                    <span>Disconnetti</span>
                </button>
            </div>

            <BottomNavigation />
        </div>
    );
};

export default Profile;
