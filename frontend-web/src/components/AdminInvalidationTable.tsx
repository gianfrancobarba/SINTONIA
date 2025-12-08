import React from 'react';
import type { InvalidationRequestData } from '../types/invalidation';
import '../css/QuestionnaireTable.css'; // Reuse existing styles

// SVG Icon Component
const ViewIcon = () => (
    <svg viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="10.24">
        <path d="M112,44H48a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,112,44Zm-4,64H52V52h56ZM208,44H144a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,208,44Zm-4,64H148V52h56Zm-92,32H48a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,112,140Zm-4,64H52V148h56Zm100-64H144a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,208,140Zm-4,64H148V148h56Z" />
    </svg>
);

interface AdminInvalidationTableProps {
    requests: InvalidationRequestData[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onView: (id: string) => void;
}

const AdminInvalidationTable: React.FC<AdminInvalidationTableProps> = ({
    requests,
    selectedId,
    onSelect,
    onView,
}) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';

        try {
            const date = new Date(dateString);

            // Format date as dd/mm/yy
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);

            // Format time as HH:mm
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    const getStatusLabel = (stato: string) => {
        switch (stato) {
            case 'pending':
                return { text: 'In Attesa', color: '#FFA726' };
            case 'approved':
                return { text: 'Approvata', color: '#7FB77E' };
            case 'rejected':
                return { text: 'Rifiutata', color: '#E57373' };
            default:
                return { text: stato, color: '#999' };
        }
    };

    return (
        <div className="questionnaire-table-container">
            <table className="questionnaire-table">
                <thead>
                    <tr>
                        <th>Nome Questionario</th>
                        <th>Richiedente</th>
                        <th>Stato</th>
                        <th>Note</th>
                        <th>Data Richiesta</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => {
                        const isSelected = selectedId === req.idRichiesta;
                        const statusInfo = getStatusLabel(req.stato);

                        return (
                            <tr
                                key={req.idRichiesta}
                                className={isSelected ? 'selected' : ''}
                                onClick={() => onSelect(req.idRichiesta)}
                            >
                                <td>{req.nomeQuestionario}</td>
                                <td>{req.nomePsicologoRichiedente}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        color: '#fff',
                                        backgroundColor: statusInfo.color,
                                        display: 'inline-block'
                                    }}>
                                        {statusInfo.text}
                                    </span>
                                </td>
                                <td style={{
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {req.note}
                                </td>
                                <td>{formatDate(req.dataRichiesta)}</td>
                                <td className="actions-cell">
                                    <button
                                        className="action-btn view-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onView(req.idRichiesta);
                                        }}
                                        aria-label="Visualizza"
                                        title="Visualizza"
                                    >
                                        <ViewIcon />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {requests.length === 0 && (
                <div className="empty-state">
                    <p>Nessuna richiesta di invalidazione trovata</p>
                </div>
            )}
        </div>
    );
};

export default AdminInvalidationTable;
