import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FileText, MessageCircle, FileQuestion, Send } from 'lucide-react';
import type { QuestionnaireData } from '../types/questionnaire';
import Toast from './Toast';
import '../css/Modal.css';

interface QuestionnaireDetailModalProps {
    questionnaire: QuestionnaireData | null;
    onClose: () => void;
    role?: 'psychologist' | 'admin';
    readOnly?: boolean; // Hide review/invalidation actions (e.g., for assigned patients)
    onRequestInvalidation?: (id: string, notes: string) => void;
    onReview?: (id: string) => void;
}

const QuestionnaireDetailModal: React.FC<QuestionnaireDetailModalProps> = ({
    questionnaire,
    onClose,
    role = 'psychologist',
    readOnly = false,
    onRequestInvalidation,
    onReview,
}) => {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    if (!questionnaire) return null;

    const [invalidationNotes, setInvalidationNotes] = useState<string>('');
    const [isReviewing, setIsReviewing] = useState(false);
    const [showReviewConfirm, setShowReviewConfirm] = useState(false);

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
        setIsReviewing(true);
        try {
            await onReview?.(questionnaire.idQuestionario);
            setToast({ message: 'Questionario revisionato con successo', type: 'success' });
            setTimeout(() => onClose(), 1000);
        } catch (error) {
            console.error('Failed to review questionnaire', error);
            setToast({ message: 'Errore durante la revisione del questionario', type: 'error' });
        } finally {
            setIsReviewing(false);
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
                    </div>

                    {/* Questions Section */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #0D475D 0%, #1a5f7a 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <FileQuestion size={20} />
                            </div>
                            <h3 style={{
                                margin: 0,
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#1a1a1a'
                            }}>Domande e Risposte</h3>
                        </div>
                        {questions.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {questions.map((question, index) => (
                                    <div key={index} style={{
                                        padding: '16px',
                                        background: '#f8f9fa',
                                        borderRadius: '12px',
                                        borderLeft: '3px solid #83B9C1'
                                    }}>
                                        <div style={{
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            color: '#0D475D',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            marginBottom: '8px'
                                        }}>
                                            Domanda {index + 1}
                                        </div>
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#1a1a1a',
                                            marginBottom: '12px',
                                            lineHeight: '1.5'
                                        }}>
                                            {question}
                                        </div>
                                        <div style={{
                                            background: 'white',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0'
                                        }}>
                                            <div style={{
                                                fontSize: '10px',
                                                fontWeight: '600',
                                                color: '#666',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                marginBottom: '6px'
                                            }}>
                                                Risposta del paziente
                                            </div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#1a1a1a',
                                                fontWeight: '500'
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

                    {/* Invalidation Notes */}
                    {questionnaire.noteInvalidazione && (
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                            marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #E57373 0%, #d55353 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <MessageCircle size={20} />
                                </div>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: '#1a1a1a'
                                }}>Note Invalidazione</h3>
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: '#666',
                                lineHeight: '1.6',
                                background: '#f8f9fa',
                                padding: '16px',
                                borderRadius: '12px',
                                borderLeft: '3px solid #E57373'
                            }}>
                                {questionnaire.noteInvalidazione}
                            </div>
                        </div>
                    )}

                    {/* Invalidation Request Section (Psychologist only, not in readOnly mode) */}
                    {role === 'psychologist' && !readOnly && (
                        (() => {
                            const isInvalidationRejected = !questionnaire.invalidato &&
                                questionnaire.dataInvalidazione &&
                                questionnaire.idAmministratoreConferma;

                            if (isInvalidationRejected) {
                                return (
                                    <div style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #E57373 0%, #D32F2F 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white'
                                            }}>
                                                <MessageCircle size={20} />
                                            </div>
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: '18px',
                                                fontWeight: '700',
                                                color: '#D32F2F'
                                            }}>Richiesta Rifiutata</h3>
                                        </div>
                                        <div style={{
                                            fontSize: '15px',
                                            color: '#666',
                                            lineHeight: '1.6',
                                            background: '#fef2f2',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            borderLeft: '3px solid #E57373'
                                        }}>
                                            La tua richiesta di invalidazione per questo questionario è stata valutata e <strong>rifiutata</strong> da un amministratore.
                                            Il punteggio e la validità del questionario rimangono confermati.
                                        </div>
                                    </div>
                                );
                            }

                            return (
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
                                    }}>Richiesta Invalidazione</h3>
                                    <div
                                        style={{
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            marginBottom: '4px',
                                            transition: 'border-color 0.2s ease'
                                        }}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#83B9C1'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                                    >
                                        <textarea
                                            placeholder="Inserisci il motivo della richiesta di invalidazione..."
                                            value={invalidationNotes}
                                            onChange={(e) => setInvalidationNotes(e.target.value)}
                                            rows={4}
                                            maxLength={2000}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: 'none',
                                                fontSize: '14px',
                                                fontFamily: 'inherit',
                                                resize: 'none',
                                                minHeight: '150px',
                                                maxHeight: '300px',
                                                overflowY: 'auto',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        textAlign: 'right',
                                        fontSize: '12px',
                                        color: invalidationNotes.length >= 2000 ? '#E57373' :
                                            invalidationNotes.length < 50 && invalidationNotes.length > 0 ? '#FFB74D' : '#999',
                                        marginBottom: '12px'
                                    }}>
                                        {invalidationNotes.length}/2000 caratteri {invalidationNotes.length > 0 && invalidationNotes.length < 50 && `(minimo 50)`}
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (invalidationNotes.trim().length >= 50) {
                                                onRequestInvalidation?.(questionnaire.idQuestionario, invalidationNotes);
                                                setInvalidationNotes('');
                                                onClose();
                                            }
                                        }}
                                        disabled={invalidationNotes.trim().length < 50}
                                        style={{
                                            width: '100%',
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: invalidationNotes.trim().length >= 50
                                                ? 'linear-gradient(135deg, #E57373 0%, #d55353 100%)'
                                                : '#e0e0e0',
                                            color: 'white',
                                            cursor: invalidationNotes.trim().length >= 50 ? 'pointer' : 'not-allowed',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            boxShadow: invalidationNotes.trim().length >= 50 ? '0 4px 12px rgba(229, 115, 115, 0.3)' : 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (invalidationNotes.trim().length >= 50) {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(229, 115, 115, 0.4)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            if (invalidationNotes.trim().length >= 50) {
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(229, 115, 115, 0.3)';
                                            }
                                        }}
                                    >
                                        <Send size={18} />
                                        Richiedi Invalidazione
                                    </button>
                                </div>
                            );
                        })()
                    )}
                </div>

                {/* Modern Footer */}
                <div style={{
                    padding: '24px 32px',
                    background: 'white',
                    borderTop: '1px solid #e8e8e8',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    {role === 'psychologist' && !readOnly && !questionnaire.revisionato && !questionnaire.invalidato && (
                        <button
                            onClick={() => setShowReviewConfirm(true)}
                            disabled={isReviewing}
                            style={{
                                padding: '12px 32px',
                                borderRadius: '12px',
                                border: 'none',
                                background: isReviewing
                                    ? '#e0e0e0'
                                    : 'linear-gradient(135deg, #83B9C1 0%, #5a9aa5 100%)',
                                color: 'white',
                                cursor: isReviewing ? 'not-allowed' : 'pointer',
                                fontSize: '15px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                                boxShadow: isReviewing ? 'none' : '0 4px 12px rgba(131, 185, 193, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                if (!isReviewing) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(131, 185, 193, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                if (!isReviewing) {
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(131, 185, 193, 0.3)';
                                }
                            }}
                        >
                            {isReviewing ? 'Attendi...' : 'Revisiona'}
                        </button>
                    )}
                </div>
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Review Confirmation Dialog */}
            {showReviewConfirm && (
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
                    onClick={() => setShowReviewConfirm(false)}
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
                            Conferma Revisione
                        </h3>
                        <p style={{
                            margin: '0 0 20px 0',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#666'
                        }}>
                            Sei sicuro di voler contrassegnare questo questionario come revisionato?
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={() => setShowReviewConfirm(false)}
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
                                    setShowReviewConfirm(false);
                                    handleReview();
                                }}
                                disabled={isReviewing}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: isReviewing ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: 'linear-gradient(135deg, #83B9C1 0%, #5a9aa5 100%)',
                                    border: 'none',
                                    color: 'white'
                                }}
                            >
                                {isReviewing ? 'Attendi...' : 'Conferma'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};



export default QuestionnaireDetailModal;
