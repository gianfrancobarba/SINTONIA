import React from 'react';
import type { PatientData } from '../types/patient';
import '../css/QuestionnaireTable.css'; // Reuse existing styles

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
                                    title={`ID Completo: ${p.idPaziente}`}
                                >
                                    {p.idPaziente.substring(0, 8)}...
                                </td>
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
                                        👁
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
