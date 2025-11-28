import React from 'react';
import type { QuestionnaireData } from '../types/psychologist';
import '../css/QuestionnaireTable.css'; // Reuse existing styles

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
        return dateString;
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
                                        👁
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
