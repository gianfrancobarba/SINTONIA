import React, { useState } from 'react';
import AdminProfileCard from '../components/AdminProfileCard';
import EmptyStateAS from '../components/EmptyStateAS.tsx';
import './AdminDashboardPage.css';

const AdministratorDashboard: React.FC = () => {
    const [selectedSection, setSelectedSection] = useState<string | null>(() => {
        return localStorage.getItem('adminDashboardSection');
    });

    const handleSectionSelect = (section: string) => {
        setSelectedSection(section);
        localStorage.setItem('adminDashboardSection', section);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-grid">
                <div className="dashboard-left">
                    <AdminProfileCard
                        selectedSection={selectedSection}
                        onSelectSection={handleSectionSelect}
                    />
                </div>
                <div className="dashboard-right">
                    <EmptyStateAS />
                </div>
            </div>
        </div>
    );
};

export default AdministratorDashboard;
