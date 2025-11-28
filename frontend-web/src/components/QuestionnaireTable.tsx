import React from 'react';
import type { QuestionnaireData } from '../types/psychologist';
import '../css/QuestionnaireTable.css';

interface QuestionnaireTableProps {
    questionnaires: QuestionnaireData[];
    role: 'psychologist' | 'admin';
    selectedId: string | null;
    onSelect: (id: string) => void;
    onView: (id: string) => void;
    onReview?: (id: string) => void;
    onRequestInvalidation?: (id: string) => void;
}

const QuestionnaireTable: React.FC<QuestionnaireTableProps> = ({
    questionnaires,
    role,
    selectedId,
    onSelect,
    onView,
    onReview,
    onRequestInvalidation,
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
                        {role === 'admin' && <th>Autore (ID Paziente)</th>}
                        <th>Tipologia</th>
                        {role === 'admin' && <th>Data Revisione</th>}
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
                                {role === 'admin' && <td>{q.idPaziente}</td>}
                                <td>{q.nomeTipologia}</td>
                                {role === 'admin' && <td>{formatDate(q.dataInvalidazione)}</td>}
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

                                    {role === 'admin' && (
                                        <>
                                            <button
                                                className="action-btn review-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onReview?.(q.idQuestionario);
                                                }}
                                                aria-label="Revisiona"
                                                title="Revisiona"
                                            >
                                                ✎
                                            </button>
                                            <button
                                                className="action-btn invalidate-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRequestInvalidation?.(q.idQuestionario);
                                                }}
                                                aria-label="Richiedi Invalidazione"
                                                title="Richiedi Invalidazione"
                                            >
                                                ⚠
                                            </button>
                                        </>
                                    )}
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

export default QuestionnaireTable;
