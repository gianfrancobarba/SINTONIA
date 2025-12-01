import React, { useState } from 'react';
import type { QuestionnaireData } from '../types/questionnaire';
import '../css/QuestionnaireDetailModal.css'; // Reuse existing styles

interface AdminQuestionnaireDetailModalProps {
    questionnaire: QuestionnaireData | null;
    onClose: () => void;
    onCancelRevision: (id: string) => void;
}

const AdminQuestionnaireDetailModal: React.FC<AdminQuestionnaireDetailModalProps> = ({
    questionnaire,
    onClose,
    onCancelRevision,
}) => {
    if (!questionnaire) return null;

    const [isCancelling, setIsCancelling] = useState(false);

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

    const handleCancelRevision = async () => {
        if (window.confirm('Sei sicuro di voler annullare la revisione di questo questionario?')) {
            setIsCancelling(true);
            try {
                await onCancelRevision(questionnaire.idQuestionario);
                onClose();
            } catch (error) {
                console.error('Failed to cancel revision', error);
                alert('Errore durante l\'annullamento della revisione');
            } finally {
                setIsCancelling(false);
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
                                <label>ID Paziente:</label>
                                <span>{questionnaire.idPaziente}</span>
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
                            <div className="info-item">
                                <label>Stato Revisione:</label>
                                <span style={{
                                    color: questionnaire.revisionato ? '#7FB77E' : '#FFB74D',
                                    fontWeight: 'bold'
                                }}>
                                    {questionnaire.revisionato ? 'REVISIONATO' : 'DA REVISIONARE'}
                                </span>
                            </div>
                            {questionnaire.revisionato && (
                                <div className="info-item">
                                    <label>Revisionato da:</label>
                                    <span>{questionnaire.idPsicologoRevisione || 'N/A'}</span>
                                </div>
                            )}
                            <div className="info-item">
                                <label>Stato Invalidazione:</label>
                                <span style={{
                                    color: questionnaire.invalidato ? '#E57373' : '#7FB77E',
                                    fontWeight: 'bold'
                                }}>
                                    {questionnaire.invalidato ? 'INVALIDATO' : 'VALIDO'}
                                </span>
                            </div>
                            {questionnaire.invalidato && (
                                <>
                                    <div className="info-item">
                                        <label>Data Invalidazione:</label>
                                        <span>{questionnaire.dataInvalidazione || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Richiesta da:</label>
                                        <span>{questionnaire.idPsicologoRichiedente || 'N/A'}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Questions and Answers Section */}
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

                    {/* Note section - visible if notes exist */}
                    {questionnaire.noteInvalidazione && (
                        <div className="notes-section">
                            <h3 className="section-title">Note Invalidazione</h3>
                            <div className="notes-content">{questionnaire.noteInvalidazione}</div>
                        </div>
                    )}

                    {/* Cancel Revision Action */}
                    {questionnaire.revisionato && (
                        <div className="invalidation-request-section">
                            <h3 className="section-title">Gestione Revisione</h3>
                            <p style={{ marginBottom: '16px', color: '#666' }}>
                                Questo questionario è stato revisionato. Puoi annullare la revisione se necessario.
                            </p>
                            <button
                                className="btn-request-invalidation" // Reusing class for style
                                style={{ backgroundColor: '#E57373' }} // Override color for danger action
                                onClick={handleCancelRevision}
                                disabled={isCancelling}
                            >
                                {isCancelling ? 'Attendi...' : 'Annulla Revisione'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {/* Footer vuoto - chiusura solo tramite X in alto */}
                </div>
            </div>
        </div>
    );
};

export default AdminQuestionnaireDetailModal;
