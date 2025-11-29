import React, { useState } from 'react';
import type { QuestionnaireData } from '../types/psychologist';
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
