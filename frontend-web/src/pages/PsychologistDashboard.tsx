import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PsychologistProfile from '../components/PsychologistProfile';
import EmptyState from '../components/EmptyState';
import PsychologistPatientList from './PsychologistPatientList';
import QuestionnaireManagement from './QuestionnaireManagement';
import '../css/PsychologistDashboard.css';

const PsychologistDashboard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        // Check if we received a section from navigation state
        const state = location.state as { selectedSection?: string } | null;
        if (state?.selectedSection) {
            setActiveSection(state.selectedSection);
        }
    }, [location]);

    const handleSectionSelect = (section: string) => {
        if (section === 'forum') {
            navigate('/forum');
        } else if (section === 'questionari') {
            navigate('/questionnaires');
        } else {
            setActiveSection(section);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-grid">
                <div className="dashboard-left">
                    <PsychologistProfile
                        onSelectSection={handleSectionSelect}
                        activeSection={activeSection}
                    />
                </div>
                <div className="dashboard-right fade-in" key={activeSection || 'empty'}>
                    <EmptyState />
                </div>
            </div>
        </div>
    );
};

export default PsychologistDashboard;
