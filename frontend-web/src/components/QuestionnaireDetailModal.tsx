import React, { useState } from 'react';
import type { QuestionnaireData } from '../types/questionnaire';
import '../css/QuestionnaireDetailModal.css';

interface QuestionnaireDetailModalProps {
    questionnaire: QuestionnaireData | null;
    onClose: () => void;
    role?: 'psychologist' | 'admin';
    onRequestInvalidation?: (id: string, notes: string) => void;
    onReview?: (id: string) => void;
}

const QuestionnaireDetailModal: React.FC<QuestionnaireDetailModalProps> = ({
    questionnaire,
    onClose,
    role = 'psychologist',
    onRequestInvalidation,
    onReview,
}) => {
    if (!questionnaire) return null;

    const [invalidationNotes, setInvalidationNotes] = useState<string>('');
    const [isReviewing, setIsReviewing] = useState(false);

    // Get questions from questionnaire data (from backend)
    const questions = questionnaire.domande || [];
    const answerOptions = questionnaire.campi || [];
    const answers = questionnaire.risposte || {};

    const getAnswerText = (questionIndex: number): string => {
        const questionId = `q${questionIndex + 1}`;
        const answerValue = answers[questionId];

        if (answerValue === undefined || answerValue === null) {
            return 'Nessuna risposta';
        }

        // If we have answer options (scale questionnaire), map the value to the option text
        if (answerOptions.length > 0 && typeof answerValue === 'number') {
            return answerOptions[answerValue] || `Valore: ${answerValue}`;
        }

        // Otherwise return the value as string
        return String(answerValue);
    };

    const handleReview = async () => {
        if (window.confirm('Sei sicuro di voler revisionare questo questionario?')) {
            setIsReviewing(true);
            try {
                await onReview?.(questionnaire.idQuestionario);
                onClose();
            } catch (error) {
                console.error('Failed to review questionnaire', error);
                alert('Errore durante la revisione del questionario');
            } finally {
                setIsReviewing(false);
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2 className="modal-title">Dettagli Questionario</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Chiudi">
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <div className="questionnaire-info">
                        <div className="info-grid">
                            <div className="info-item">
                                <label>ID Questionario:</label>
                                <span>{questionnaire.idQuestionario}</span>
                            </div>
                            <div className="info-item">
                                <label>Tipologia:</label>
                                <span>{questionnaire.nomeTipologia}</span>
                            </div>
                            <div className="info-item">
                                <label>Data Compilazione:</label>
                                <span>{new Date(questionnaire.dataCompilazione).toLocaleString('it-IT', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                            {questionnaire.score !== null && (
                                <div className="info-item">
                                    <label>Punteggio:</label>
                                    <span className="score-value">{questionnaire.score}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="questions-section">
                        <h3 className="section-title">Domande e Risposte</h3>
                        {questions.length > 0 ? (
                            <div className="questions-list">
                                {questions.map((question, index) => (
                                    <div key={index} className="question-item">
                                        <div className="question-number">Domanda {index + 1}</div>
                                        <div className="question-text">{question}</div>
                                        <div className="answer-box">
                                            <label>Risposta del paziente:</label>
                                            <div className="answer-value">
                                                {getAnswerText(index)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>
                                Nessuna domanda disponibile per questo questionario.
                            </p>
                        )}
                    </div>

                    {questionnaire.noteInvalidazione && (
                        <div className="notes-section">
                            <h3 className="section-title">Note Invalidazione</h3>
                            <div className="notes-content">{questionnaire.noteInvalidazione}</div>
                        </div>
                    )}

                    {role === 'psychologist' && (
                        <div className="invalidation-request-section">
                            <h3 className="section-title">Richiesta Invalidazione</h3>
                            <div className="invalidation-form">
                                <textarea
                                    className="invalidation-textarea"
                                    placeholder="Inserisci il motivo della richiesta di invalidazione..."
                                    value={invalidationNotes}
                                    onChange={(e) => setInvalidationNotes(e.target.value)}
                                    rows={4}
                                />
                                <button
                                    className="btn-request-invalidation"
                                    onClick={() => {
                                        if (invalidationNotes.trim()) {
                                            onRequestInvalidation?.(questionnaire.idQuestionario, invalidationNotes);
                                            setInvalidationNotes('');
                                            onClose();
                                        }
                                    }}
                                    disabled={!invalidationNotes.trim()}
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{ marginRight: '8px', verticalAlign: 'middle' }}
                                    >
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <path d="M12 18v-6" />
                                        <path d="M9 15l3 3 3-3" />
                                    </svg>
                                    Richiedi Invalidazione
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {role === 'psychologist' && (
                        <button
                            className="btn-review"
                            onClick={handleReview}
                            disabled={isReviewing}
                        >
                            {isReviewing ? 'Attendi...' : 'Revisiona'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionnaireDetailModal;
