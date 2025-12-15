import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FileText, X } from 'lucide-react';
import type { QuestionnaireData } from '../types/questionnaire';
import Toast from './Toast';
import '../css/Modal.css';

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
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
        setIsCancelling(true);
        try {
            await onCancelRevision(questionnaire.idQuestionario);
            setToast({ message: 'Revisione annullata con successo', type: 'success' });
            setTimeout(() => onClose(), 1000);
        } catch (error) {
            console.error('Failed to cancel revision', error);
            setToast({ message: 'Errore durante l\'annullamento della revisione', type: 'error' });
        } finally {
            setIsCancelling(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay-blur" onClick={onClose}>
            <div
                className="modal-card modal-card-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Gradient */}
                <div className="modal-header-gradient">
                    <div className="modal-header-content">
                        <div className="modal-header-text">
                            <h2 className="modal-header-title">
                                Dettagli Questionario
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="modal-close-btn-rounded"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="modal-body-gray modal-body-scrollable">
                    {/* Compact Info Section */}
                    <div className="modal-data-section">
                        <div className="modal-data-section-title">
                            <div className="modal-data-section-title-icon">
                                <FileText size={14} />
                            </div>
                            Informazioni Questionario
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot modal-data-row-dot-teal"></div>
                            <span className="modal-data-row-label">ID Questionario</span>
                            <span className="modal-data-row-value">{questionnaire.idQuestionario}</span>
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot modal-data-row-dot-cyan"></div>
                            <span className="modal-data-row-label">Tipologia</span>
                            <span className="modal-data-row-value modal-data-row-value-highlight">{questionnaire.nomeTipologia}</span>
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot modal-data-row-dot-cyan"></div>
                            <span className="modal-data-row-label">ID Paziente</span>
                            <span className="modal-data-row-value">{questionnaire.idPaziente}</span>
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot modal-data-row-dot-green"></div>
                            <span className="modal-data-row-label">Data Compilazione</span>
                            <span className="modal-data-row-value">
                                {new Date(questionnaire.dataCompilazione).toLocaleString('it-IT', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>

                        {questionnaire.score !== null && (
                            <div className="modal-data-row">
                                <div className="modal-data-row-dot modal-data-row-dot-orange"></div>
                                <span className="modal-data-row-label">Punteggio</span>
                                <span className="modal-data-row-value modal-data-row-value-highlight">{questionnaire.score}</span>
                            </div>
                        )}

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot" style={{ background: questionnaire.revisionato ? '#7FB77E' : '#FFB74D' }}></div>
                            <span className="modal-data-row-label">Stato Revisione</span>
                            <span className="modal-data-row-value" style={{ color: questionnaire.revisionato ? '#7FB77E' : '#FFB74D', fontWeight: '600' }}>
                                {questionnaire.revisionato ? 'REVISIONATO' : 'DA REVISIONARE'}
                            </span>
                        </div>

                        {questionnaire.revisionato && (
                            <div className="modal-data-row">
                                <div className="modal-data-row-dot modal-data-row-dot-cyan"></div>
                                <span className="modal-data-row-label">Revisionato da</span>
                                <span className="modal-data-row-value">{questionnaire.idPsicologoRevisione || 'N/A'}</span>
                            </div>
                        )}

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot" style={{ background: questionnaire.invalidato ? '#E57373' : '#7FB77E' }}></div>
                            <span className="modal-data-row-label">Stato Invalidazione</span>
                            <span className="modal-data-row-value" style={{ color: questionnaire.invalidato ? '#E57373' : '#7FB77E', fontWeight: '600' }}>
                                {questionnaire.invalidato ? 'INVALIDATO' : 'VALIDO'}
                            </span>
                        </div>

                        {questionnaire.invalidato && (
                            <>
                                <div className="modal-data-row">
                                    <div className="modal-data-row-dot modal-data-row-dot-red"></div>
                                    <span className="modal-data-row-label">Data Invalidazione</span>
                                    <span className="modal-data-row-value">{questionnaire.dataInvalidazione || 'N/A'}</span>
                                </div>
                                <div className="modal-data-row">
                                    <div className="modal-data-row-dot modal-data-row-dot-red"></div>
                                    <span className="modal-data-row-label">Richiesta da</span>
                                    <span className="modal-data-row-value">{questionnaire.idPsicologoRichiedente || 'N/A'}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Questions and Answers Section */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        marginBottom: '16px'
                    }}>
                        <h3 style={{
                            margin: '0 0 20px 0',
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#1a1a1a'
                        }}>Domande e Risposte</h3>
                        {questions.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {questions.map((question, index) => (
                                    <div key={index} style={{
                                        background: '#f8f9fa',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        border: '1px solid #e8e8e8'
                                    }}>
                                        <div style={{
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            color: '#83B9C1',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            marginBottom: '8px'
                                        }}>Domanda {index + 1}</div>
                                        <div style={{
                                            fontSize: '15px',
                                            fontWeight: '500',
                                            color: '#333',
                                            marginBottom: '12px'
                                        }}>{question}</div>
                                        <div style={{
                                            background: 'white',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            borderLeft: '3px solid #7FB77E'
                                        }}>
                                            <div style={{
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                color: '#666',
                                                textTransform: 'uppercase',
                                                marginBottom: '6px'
                                            }}>Risposta del paziente:</div>
                                            <div style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: '#1a1a1a'
                                            }}>
                                                {getAnswerText(index)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>
                                Nessuna domanda disponibile per questo questionario.
                            </p>
                        )}
                    </div>

                    {/* Note section - visible if notes exist */}
                    {questionnaire.noteInvalidazione && (
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                            marginBottom: '16px'
                        }}>
                            <h3 style={{
                                margin: '0 0 16px 0',
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#1a1a1a'
                            }}>Note Invalidazione</h3>
                            <div style={{
                                fontSize: '14px',
                                color: '#666',
                                lineHeight: '1.6',
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere',
                                whiteSpace: 'pre-wrap'
                            }}>{questionnaire.noteInvalidazione}</div>
                        </div>
                    )}

                    {/* Cancel Revision Action */}
                    {questionnaire.revisionato && (
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                        }}>
                            <h3 style={{
                                margin: '0 0 16px 0',
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#1a1a1a'
                            }}>Gestione Revisione</h3>
                            <p style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
                                Questo questionario è stato revisionato. Puoi annullare la revisione se necessario.
                            </p>
                            <button
                                onClick={() => setShowCancelConfirm(true)}
                                disabled={isCancelling}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #E57373 0%, #d55353 100%)',
                                    color: 'white',
                                    cursor: isCancelling ? 'not-allowed' : 'pointer',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 12px rgba(229, 115, 115, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isCancelling) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(229, 115, 115, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(229, 115, 115, 0.3)';
                                }}
                            >
                                <X size={18} />
                                {isCancelling ? 'Attendi...' : 'Annulla Revisione'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Modern Footer */}
                <div style={{
                    padding: '24px 32px',
                    background: 'white',
                    borderTop: '1px solid #e8e8e8'
                }}>
                    {/* Footer vuoto - chiusura solo tramite X in alto */}
                </div>
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Cancel Revision Confirmation Dialog */}
            {showCancelConfirm && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10001
                    }}
                    onClick={() => setShowCancelConfirm(false)}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '24px',
                            maxWidth: '400px',
                            width: '90%',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{
                            margin: '0 0 12px 0',
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            Conferma Annullamento Revisione
                        </h3>
                        <p style={{
                            margin: '0 0 20px 0',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#666'
                        }}>
                            Sei sicuro di voler annullare la revisione di questo questionario? Il questionario tornerà nello stato "da revisionare".
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: '#f3f4f6',
                                    border: '1px solid #e5e7eb',
                                    color: '#374151'
                                }}
                            >
                                Annulla
                            </button>
                            <button
                                onClick={() => {
                                    setShowCancelConfirm(false);
                                    handleCancelRevision();
                                }}
                                disabled={isCancelling}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: isCancelling ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: 'linear-gradient(135deg, #E57373 0%, #d55353 100%)',
                                    border: 'none',
                                    color: 'white'
                                }}
                            >
                                {isCancelling ? 'Attendi...' : 'Conferma'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};



export default AdminQuestionnaireDetailModal;
