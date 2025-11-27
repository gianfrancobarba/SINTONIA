import React, { useState, useEffect } from 'react';
import type { QuestionnaireData } from '../types/psychologist';
import { getQuestionnaireStatus } from '../types/psychologist';
import { viewQuestionnaire } from '../services/questionnaire.service';
import '../css/QuestionnaireDetailModal.css';

interface QuestionnaireDetailModalProps {
    questionnaireId: string | null;
    onClose: () => void;
}

const QuestionnaireDetailModal: React.FC<QuestionnaireDetailModalProps> = ({
    questionnaireId,
    onClose,
}) => {
    const [questionnaire, setQuestionnaire] = useState<QuestionnaireData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (questionnaireId) {
            loadQuestionnaireDetails();
        }
    }, [questionnaireId]);

    const loadQuestionnaireDetails = async () => {
        if (!questionnaireId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await viewQuestionnaire(questionnaireId);
            setQuestionnaire(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore nel caricamento del questionario');
        } finally {
            setLoading(false);
        }
    };

    if (!questionnaireId) return null;

    const getStatusClassName = (status: string) => {
        return `status-badge status-${status.toLowerCase()}`;
    };

    // Render risposte from JSONB field
    const renderRisposte = (risposte: any) => {
        if (!risposte || typeof risposte !== 'object') {
            return <div className="no-data">Nessuna risposta disponibile</div>;
        }

        // Convert risposte object to array of key-value pairs
        const entries = Object.entries(risposte);

        if (entries.length === 0) {
            return <div className="no-data">Nessuna risposta disponibile</div>;
        }

        return entries.map(([key, value], index) => (
            <div key={key} className="question-item">
                <div className="question-number">Domanda {index + 1}</div>
                <div className="question-text">{key}</div>
                <div className="answer-box">
                    <label>Risposta del paziente:</label>
                    <div className="answer-value">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {loading && (
                    <div className="modal-loading">
                        <div className="loading-spinner"></div>
                        <p>Caricamento...</p>
                    </div>
                )}

                {error && (
                    <div className="modal-error">
                        <p>❌ {error}</p>
                        <button className="btn-close" onClick={onClose}>
                            Chiudi
                        </button>
                    </div>
                )}

                {questionnaire && !loading && !error && (
                    <>
                        <div className="modal-header">
                            <div className="modal-title-section">
                                <h2 className="modal-title">Dettagli Questionario</h2>
                                <span className={getStatusClassName(getQuestionnaireStatus(questionnaire))}>
                                    {getQuestionnaireStatus(questionnaire)}
                                </span>
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
                                        <span>{new Date(questionnaire.dataCompilazione).toLocaleDateString('it-IT')}</span>
                                    </div>
                                    {questionnaire.score !== null && (
                                        <div className="info-item">
                                            <label>Punteggio:</label>
                                            <span className="score-value">{questionnaire.score}</span>
                                        </div>
                                    )}
                                    {questionnaire.cambiamento && (
                                        <div className="info-item">
                                            <label>Cambiamento:</label>
                                            <span className="badge-warning">⚠️ Rilevato</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="questions-section">
                                <h3 className="section-title">Risposte del Paziente</h3>
                                <div className="questions-list">
                                    {renderRisposte(questionnaire.risposte)}
                                </div>
                            </div>

                            {questionnaire.noteInvalidazione && (
                                <div className="notes-section">
                                    <h3 className="section-title">Note Invalidazione</h3>
                                    <div className="notes-content">{questionnaire.noteInvalidazione}</div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-close" onClick={onClose}>
                                Chiudi
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuestionnaireDetailModal;
