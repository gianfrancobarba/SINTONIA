import React from 'react';
import '../css/AppLayout.css';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
}

/**
 * PageHeader - Unified gradient header component for all pages
 * 
 * Usage:
 * <PageHeader 
 *     title="Gestione Pazienti"
 *     subtitle="Visualizza e gestisci tutti i pazienti"
 *     icon={<Users size={24} />}
 * />
 */
const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon }) => {
    return (
        <div className="page-header">
            <div className="page-header-content">
                <div className="page-header-icon">
                    {icon}
                </div>
                <div className="page-header-text">
                    <h1 className="page-header-title">{title}</h1>
                    {subtitle && (
                        <p className="page-header-subtitle">{subtitle}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
