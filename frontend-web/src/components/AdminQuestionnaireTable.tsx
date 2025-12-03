import React from 'react';
import type { QuestionnaireData } from '../types/psychologist';
import '../css/QuestionnaireTable.css'; // Reuse existing styles

// SVG Icon Component
const ViewIcon = () => (
    <svg viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="10.24">
        <path d="M112,44H48a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,112,44Zm-4,64H52V52h56ZM208,44H144a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,208,44Zm-4,64H148V52h56Zm-92,32H48a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,112,140Zm-4,64H52V148h56Zm100-64H144a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,208,140Zm-4,64H148V148h56Z" />
    </svg>
);

interface AdminQuestionnaireTableProps {
    questionnaires: QuestionnaireData[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onView: (id: string) => void;
}

const AdminQuestionnaireTable: React.FC<AdminQuestionnaireTableProps> = ({
    questionnaires,
    selectedId,
    onSelect,
    onView,
}) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="questionnaire-table-container">
            <table className="questionnaire-table">
                <thead>
                    <tr>
                        <th>ID Questionario</th>
                        <th>Tipologia</th>
                        <th>Data Compilazione</th>
                        <th>Score</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {questionnaires.map((q) => {
                        const isSelected = selectedId === q.idQuestionario;

                        return (
                            <tr
                                key={q.idQuestionario}
                                className={isSelected ? 'selected' : ''}
                                onClick={() => onSelect(q.idQuestionario)}
                            >
                                <td
                                    className="questionnaire-id-cell"
                                    title={`ID Completo: ${q.idQuestionario}`}
                                >
                                    {q.idQuestionario.substring(0, 8)}...
                                </td>
                                <td>{q.nomeTipologia}</td>
                                <td>{formatDate(q.dataCompilazione)}</td>
                                <td>{q.score !== null ? q.score : '-'}</td>
                                <td className="actions-cell">
                                    <button
                                        className="action-btn view-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onView(q.idQuestionario);
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

            {questionnaires.length === 0 && (
                <div className="empty-state">
                    <p>Nessun questionario trovato</p>
                </div>
            )}
        </div>
    );
};

export default AdminQuestionnaireTable;
