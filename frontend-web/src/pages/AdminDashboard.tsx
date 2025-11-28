import React, { useState } from 'react';
import AdminProfile from '../components/AdminProfile';
import EmptyState from '../components/EmptyState';
import AdminQuestionnaireList from './AdminQuestionnaireList';
import '../css/PsychologistDashboard.css'; // Reuse layout styles

const AdminDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const renderContent = () => {
        switch (activeSection) {
            case 'questionari':
                return <AdminQuestionnaireList />;
            default:
                return <EmptyState />;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-grid">
                <div className="dashboard-left">
                    <AdminProfile onSelectSection={setActiveSection} />
                </div>
                <div className="dashboard-right">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
