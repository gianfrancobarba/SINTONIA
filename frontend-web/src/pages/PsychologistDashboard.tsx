import React from 'react';
import PsychologistProfile from '../components/PsychologistProfile';
import EmptyState from '../components/EmptyState';
import '../css/PsychologistDashboard.css';

const PsychologistDashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-grid">
                <div className="dashboard-left">
                    <PsychologistProfile />
                </div>
                <div className="dashboard-right">
                    <EmptyState />
                </div>
            </div>
        </div>
    );
};

export default PsychologistDashboard;
