import React from 'react';
import { ClipboardList } from 'lucide-react';
import type { QuestionnaireData } from '../types/psychologist';
import '../css/QuestionnaireTable.css';
import '../css/EmptyState.css';

// SVG Icon Component
const ViewIcon = () => (
    <svg viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="10.24">
        <path d="M112,44H48a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,112,44Zm-4,64H52V52h56ZM208,44H144a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,208,44Zm-4,64H148V52h56Zm-92,32H48a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,112,140Zm-4,64H52V148h56Zm100-64H144a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,208,140Zm-4,64H148V148h56Z" />
    </svg>
);

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
                        {role === 'admin' && <th>Autore (ID Paziente)</th>}
                        <th>Tipologia</th>
                        <th>Data Compilazione</th>
                        <th>Score</th>
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
                                >
                                    {q.idQuestionario.substring(0, 8)}...
                                </td>
                                {role === 'admin' && <td>{q.idPaziente}</td>}
                                <td>{q.nomeTipologia}</td>
                                <td>{formatDate(q.dataCompilazione)}</td>
                                <td>{q.score !== null ? q.score : '-'}</td>
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
                                        <ViewIcon />
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
                <div className="unified-empty-state">
                    <div className="unified-empty-icon">
                        <ClipboardList size={48} />
                    </div>
                    <h3 className="unified-empty-title">Nessun Questionario</h3>
                    <p className="unified-empty-message">
                        Non sono presenti questionari da visualizzare.
                    </p>
                </div>
            )}
        </div>
    );
};

export default QuestionnaireTable;
