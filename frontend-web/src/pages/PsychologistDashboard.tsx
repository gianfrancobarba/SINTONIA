import React, { useState } from 'react';
import PsychologistProfile from '../components/PsychologistProfile';
import EmptyState from '../components/EmptyState';
import PsychologistPatientList from './PsychologistPatientList';
import QuestionnaireManagement from './QuestionnaireManagement';
import '../css/PsychologistDashboard.css';

const PsychologistDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const renderContent = () => {
        switch (activeSection) {
            case 'pazienti':
                return <PsychologistPatientList />;
            case 'questionari':
                return <QuestionnaireManagement showProfile={false} />;
            default:
                return <EmptyState />;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-grid">
                <div className="dashboard-left">
                    <PsychologistProfile onSelectSection={setActiveSection} />
                </div>
                <div className="dashboard-right">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default PsychologistDashboard;
