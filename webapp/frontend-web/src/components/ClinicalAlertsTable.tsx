import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { ClinicalAlert } from '../types/alert';
import '../css/EmptyState.css';

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
            <div className="unified-empty-state">
                <div className="unified-empty-icon">
                    <AlertCircle size={48} />
                </div>
                <h3 className="unified-empty-title">Nessun Alert Clinico</h3>
                <p className="unified-empty-message">
                    Non ci sono alert clinici da gestire al momento.
                </p>
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
