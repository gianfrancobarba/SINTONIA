import React from 'react';
import type { ClinicalAlert } from '../types/alert';

interface ClinicalAlertsTableProps {
    alerts: ClinicalAlert[];
    onAccept: (id: string) => void;
}

const ClinicalAlertsTable: React.FC<ClinicalAlertsTableProps> = ({ alerts, onAccept }) => {
    const formatDate = (date: Date | string): string => {
        const d = typeof date === 'string' ? new Date(date) : date;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} alle ${hours}:${minutes}`;
    };

    if (alerts.length === 0) {
        return (
            <div className="empty-state">
                <p>Nessun alert clinico da gestire</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="alerts-table">
                <thead>
                    <tr>
                        <th>ID Alert</th>
                        <th>Data</th>
                        <th>Stato</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {alerts.map((alert) => (
                        <tr key={alert.idAlert}>
                            <td className="alert-id">
                                <span className="id-badge">{alert.idAlert.substring(0, 8)}...</span>
                            </td>
                            <td className="alert-date">{formatDate(alert.dataAlert)}</td>
                            <td className="alert-status">
                                <span className="status-badge pending">Non Accettato</span>
                            </td>
                            <td className="alert-actions">
                                <button
                                    className="accept-btn"
                                    onClick={() => onAccept(alert.idAlert)}
                                >
                                    Accetta
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClinicalAlertsTable;
