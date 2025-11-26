/* Dashboard Vuota */

import React from 'react';
import '../css/EmptyState.css';

const EmptyState: React.FC = () => {
    return (
        <div className="empty-state">
            <div className="empty-state-content">
                <h2 className="empty-state-title">Benvenuto nella Dashboard</h2>
                <p className="empty-state-message">
                    Seleziona una sezione dal menu a sinistra per iniziare
                </p>
            </div>
        </div>
    );
};

export default EmptyState;
