import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminProfile from '../components/AdminProfile';
import EmptyState from '../components/EmptyState';
import AdminQuestionnaireList from './AdminQuestionnaireList';
import AdminPatientList from './AdminPatientList';
import AdminPsychologistList from './AdminPsychologistList';
import AdminInvalidationList from './AdminInvalidationList';
import AdminPersonalArea from '../components/AdminPersonalArea';
import '../css/PsychologistDashboard.css'; // Reuse layout styles

const AdminDashboard: React.FC = () => {
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
        } else {
            setActiveSection(section);
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'area-personale':
                return <AdminPersonalArea />;
            case 'questionari':
                return <AdminQuestionnaireList />;
            case 'pazienti':
                return <AdminPatientList />;
            case 'psicologi':
                return <AdminPsychologistList />;
            case 'invalidazione':
                return <AdminInvalidationList />;
            default:
                return <EmptyState />;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-grid">
                <div className="dashboard-left">
                    <AdminProfile
                        onSelectSection={handleSectionSelect}
                        activeSection={activeSection}
                    />
                </div>
                <div className="dashboard-right fade-in" key={activeSection || 'empty'}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
