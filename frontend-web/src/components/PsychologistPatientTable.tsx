import React from 'react';
import type { PatientData } from '../types/patient';
import '../css/QuestionnaireTable.css'; // Reuse existing styles

// SVG Icon Component
const ViewIcon = () => (
    <svg viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="10.24">
        <path d="M112,44H48a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,112,44Zm-4,64H52V52h56ZM208,44H144a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,208,44Zm-4,64H148V52h56Zm-92,32H48a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,112,140Zm-4,64H52V148h56Zm100-64H144a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,208,140Zm-4,64H148V148h56Z" />
    </svg>
);

interface PsychologistPatientTableProps {
    patients: PatientData[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onView: (id: string) => void;
}

const PsychologistPatientTable: React.FC<PsychologistPatientTableProps> = ({
    patients,
    selectedId,
    onSelect,
    onView,
}) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return dateString;
    };

    return (
        <div className="questionnaire-table-container">
            <table className="questionnaire-table">
                <thead>
                    <tr>
                        <th>ID Paziente</th>
                        <th>Nome</th>
                        <th>Cognome</th>
                        <th>Data Ingresso</th>
                        <th>Score</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((p) => {
                        const isSelected = selectedId === p.idPaziente;

                        return (
                            <tr
                                key={p.idPaziente}
                                className={isSelected ? 'selected' : ''}
                                onClick={() => onSelect(p.idPaziente)}
                            >
                                <td
                                    className="questionnaire-id-cell"
                                >
                                    {p.idPaziente.substring(0, 8)}...
                                </td>
                                <td>{p.nome}</td>
                                <td>{p.cognome}</td>
                                <td>{formatDate(p.dataIngresso)}</td>
                                <td>{p.score !== null ? p.score : '-'}</td>
                                <td className="actions-cell">
                                    <button
                                        className="action-btn view-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onView(p.idPaziente);
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

            {patients.length === 0 && (
                <div className="empty-state">
                    <p>Nessun paziente assegnato</p>
                </div>
            )}
        </div>
    );
};

export default PsychologistPatientTable;
