import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Hash, FileText, Calendar, Award, MessageCircle, FileQuestion, Send } from 'lucide-react';
import type { QuestionnaireData } from '../types/questionnaire';
import Toast from './Toast';

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
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
        <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(4px)' }}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '1100px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}
            >
                {/* Modern Header with Gradient */}
                <div style={{
                    background: 'linear-gradient(135deg, #0D475D 0%, #1a5f7a 50%, #83B9C1 100%)',
                    padding: '32px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-10%',
                        width: '300px',
                        height: '300px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '50%',
                        filter: 'blur(40px)'
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{
                                    margin: '0 0 8px 0',
                                    fontSize: '28px',
                                    fontWeight: '700',
                                    color: 'white',
                                    letterSpacing: '-0.5px'
                                }}>
                                    Dettagli Questionario
                                </h2>
                                <p style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontWeight: '500'
                                }}>
                                    {questionnaire.nomeTipologia}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(10px)',
                                    border: 'none',
                                    color: 'white',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    fontSize: '20px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                                    e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                    e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body with Modern Cards */}
                <div style={{
                    padding: '32px',
                    background: '#f8f9fa',
                    maxHeight: 'calc(90vh - 200px)',
                    overflowY: 'auto'
                }}>
                    {/* Info Cards Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '24px'
                    }}>
                        <InfoCard
                            icon={<Hash size={16} />}
                            label="ID Questionario"
                            value={questionnaire.idQuestionario}
                            iconColor="#0D475D"
                        />
                        <InfoCard
                            icon={<FileText size={16} />}
                            label="Tipologia"
                            value={questionnaire.nomeTipologia}
                            iconColor="#83B9C1"
                        />
                        <InfoCard
                            icon={<Calendar size={16} />}
                            label="Data Compilazione"
                            value={new Date(questionnaire.dataCompilazione).toLocaleString('it-IT', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            iconColor="#7FB77E"
                        />
                        {questionnaire.score !== null && (
                            <InfoCard
                                icon={<Award size={16} />}
                                label="Punteggio"
                                value={String(questionnaire.score)}
                                iconColor="#FFB74D"
                            />
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

                    {/* Invalidation Request Section (Psychologist only) */}
                    {role === 'psychologist' && (
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
                            <textarea
                                placeholder="Inserisci il motivo della richiesta di invalidazione..."
                                value={invalidationNotes}
                                onChange={(e) => setInvalidationNotes(e.target.value)}
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease',
                                    marginBottom: '12px'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#83B9C1'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            />
                            <button
                                onClick={() => {
                                    if (invalidationNotes.trim()) {
                                        onRequestInvalidation?.(questionnaire.idQuestionario, invalidationNotes);
                                        setInvalidationNotes('');
                                        onClose();
                                    }
                                }}
                                disabled={!invalidationNotes.trim()}
                                style={{
                                    width: '100%',
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: invalidationNotes.trim()
                                        ? 'linear-gradient(135deg, #E57373 0%, #d55353 100%)'
                                        : '#e0e0e0',
                                    color: 'white',
                                    cursor: invalidationNotes.trim() ? 'pointer' : 'not-allowed',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    boxShadow: invalidationNotes.trim() ? '0 4px 12px rgba(229, 115, 115, 0.3)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (invalidationNotes.trim()) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(229, 115, 115, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    if (invalidationNotes.trim()) {
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(229, 115, 115, 0.3)';
                                    }
                                }}
                            >
                                <Send size={18} />
                                Richiedi Invalidazione
                            </button>
                        </div>
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
                    {role === 'psychologist' && (
                        <button
                            onClick={handleReview}
                            disabled={isReviewing}
                            style={{
                                padding: '12px 32px',
                                borderRadius: '12px',
                                border: 'none',
                                background: isReviewing
                                    ? '#e0e0e0'
                                    : 'linear-gradient(135deg, #7FB77E 0%, #5fa05d 100%)',
                                color: 'white',
                                cursor: isReviewing ? 'not-allowed' : 'pointer',
                                fontSize: '15px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                                boxShadow: isReviewing ? 'none' : '0 4px 12px rgba(127, 183, 126, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                if (!isReviewing) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(127, 183, 126, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                if (!isReviewing) {
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(127, 183, 126, 0.3)';
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
        </div>,
        document.body
    );
};

// Info Card Component
const InfoCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    iconColor: string;
}> = ({ icon, label, value, iconColor }) => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '14px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e8e8e8',
            transition: 'all 0.3s ease'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${iconColor} 0%, ${iconColor}dd 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    {icon}
                </div>
                <span style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {label}
                </span>
            </div>
            <p style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a1a1a'
            }}>
                {value}
            </p>
        </div>
    );
};

export default QuestionnaireDetailModal;
