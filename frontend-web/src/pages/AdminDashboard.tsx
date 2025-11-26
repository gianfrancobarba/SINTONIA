import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth.service';
import '../css/Login.css'; // Reusing some styles for now or create new ones if needed

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container" style={{ padding: '20px' }}>
            <h1>Admin Dashboard</h1>
            <p>Benvenuto Amministratore.</p>
            <button onClick={handleLogout} className="login-button" style={{ width: 'auto', marginTop: '20px' }}>
                Logout
            </button>
        </div>
    );
};

export default AdminDashboard;
