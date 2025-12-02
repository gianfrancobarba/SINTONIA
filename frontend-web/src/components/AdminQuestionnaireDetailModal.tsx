import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FileText, Calendar, User, Hash, Award, CheckCircle, AlertCircle, X, XCircle } from 'lucide-react';
import type { QuestionnaireData } from '../types/questionnaire';
import Toast from './Toast';

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
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '16px',
                        marginBottom: '24px'
                    }}>
                        {/* ID Questionario Card */}
                        <InfoCard
                            icon={<Hash size={16} />}
                            label="ID Questionario"
                            value={questionnaire.idQuestionario}
                            iconColor="#0D475D"
                        />

                        {/* Tipologia Card */}
                        <InfoCard
                            icon={<FileText size={16} />}
                            label="Tipologia"
                            value={questionnaire.nomeTipologia}
                            iconColor="#83B9C1"
                        />

                        {/* ID Paziente Card */}
                        <InfoCard
                            icon={<User size={16} />}
                            label="ID Paziente"
                            value={questionnaire.idPaziente}
                            iconColor="#5a9aa5"
                        />

                        {/* Data Compilazione Card */}
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

                        {/* Punteggio Card */}
                        {questionnaire.score !== null && (
                            <InfoCard
                                icon={<Award size={16} />}
                                label="Punteggio"
                                value={String(questionnaire.score)}
                                iconColor="#FFB74D"
                            />
                        )}

                        {/* Stato Revisione Card */}
                        <InfoCard
                            icon={questionnaire.revisionato ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                            label="Stato Revisione"
                            value={questionnaire.revisionato ? 'REVISIONATO' : 'DA REVISIONARE'}
                            iconColor={questionnaire.revisionato ? '#7FB77E' : '#FFB74D'}
                            valueColor={questionnaire.revisionato ? '#7FB77E' : '#FFB74D'}
                        />

                        {/* Revisionato da */}
                        {questionnaire.revisionato && (
                            <InfoCard
                                icon={<User size={16} />}
                                label="Revisionato da"
                                value={questionnaire.idPsicologoRevisione || 'N/A'}
                                iconColor="#83B9C1"
                            />
                        )}

                        {/* Stato Invalidazione Card */}
                        <InfoCard
                            icon={questionnaire.invalidato ? <XCircle size={16} /> : <CheckCircle size={16} />}
                            label="Stato Invalidazione"
                            value={questionnaire.invalidato ? 'INVALIDATO' : 'VALIDO'}
                            iconColor={questionnaire.invalidato ? '#E57373' : '#7FB77E'}
                            valueColor={questionnaire.invalidato ? '#E57373' : '#7FB77E'}
                        />

                        {/* Invalidation details */}
                        {questionnaire.invalidato && (
                            <>
                                <InfoCard
                                    icon={<Calendar size={16} />}
                                    label="Data Invalidazione"
                                    value={questionnaire.dataInvalidazione || 'N/A'}
                                    iconColor="#E57373"
                                />
                                <InfoCard
                                    icon={<User size={16} />}
                                    label="Richiesta da"
                                    value={questionnaire.idPsicologoRichiedente || 'N/A'}
                                    iconColor="#E57373"
                                />
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
                                lineHeight: '1.6'
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
                                onClick={handleCancelRevision}
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
    valueColor?: string;
}> = ({ icon, label, value, iconColor, valueColor }) => {
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
                color: valueColor || '#1a1a1a'
            }}>
                {value}
            </p>
        </div>
    );
};

export default AdminQuestionnaireDetailModal;
