import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { ForumQuestion } from '../types/forum';
import { X } from 'lucide-react';
import '../css/ForumReplyModal.css';

interface ForumReplyModalProps {
    question: ForumQuestion;
    existingAnswer?: string;
    onClose: () => void;
    onSubmit: (content: string) => void;
    isEditing?: boolean;
}

const ForumReplyModal: React.FC<ForumReplyModalProps> = ({
    question,
    existingAnswer = '',
    onClose,
    onSubmit,
    isEditing = false
}) => {
    const [content, setContent] = useState(existingAnswer);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleSubmit = async () => {
        // Validation
        if (content.trim().length < 20) {
            setError('La risposta deve contenere almeno 20 caratteri');
            return;
        }

        if (content.trim().length > 2000) {
            setError('La risposta non può superare i 2000 caratteri');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(content.trim());
            onClose();
        } catch (err) {
            setError('Errore durante l\'invio della risposta');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        setError('');
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(4px)' }}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '700px',
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
                                    {isEditing ? 'Modifica Risposta' : 'Risposta alla domanda'}
                                </h2>
                                <p style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontWeight: '500'
                                }}>
                                    {isEditing ? 'Aggiorna la tua risposta professionale' : 'Fornisci supporto al paziente'}
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
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body with Modern Styling */}
                <div style={{
                    padding: '32px',
                    background: '#f8f9fa',
                    maxHeight: 'calc(90vh - 200px)',
                    overflowY: 'auto'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #e8e8e8',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#666',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '8px'
                        }}>
                            Domanda
                        </div>
                        <div style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '12px'
                        }}>
                            {question.titolo}
                        </div>
                        <div style={{
                            fontSize: '15px',
                            color: '#4a4a4a',
                            lineHeight: '1.6'
                        }}>
                            {question.testo}
                        </div>
                    </div>

                    <div className="reply-section">
                        <label htmlFor="reply-textarea" style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1a1a1a',
                            marginBottom: '8px'
                        }}>
                            {isEditing ? 'Modifica la tua risposta' : 'Scrivi la tua risposta professionale'}
                        </label>
                        <textarea
                            id="reply-textarea"
                            className="reply-textarea"
                            value={content}
                            onChange={handleContentChange}
                            placeholder="Fornisci una risposta professionale e di supporto al paziente..."
                            rows={8}
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '12px',
                                fontSize: '15px',
                                lineHeight: '1.6',
                                resize: 'vertical',
                                minHeight: '150px',
                                outline: 'none',
                                transition: 'all 0.2s ease',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#0D475D'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '8px',
                            fontSize: '13px',
                            color: '#666'
                        }}>
                            <span>
                                {content.length < 20 && (
                                    <span style={{ color: '#E57373' }}>Minimo 20 caratteri</span>
                                )}
                            </span>
                            <span>
                                <span style={{
                                    color: content.length < 20 || content.length > 2000 ? '#E57373' : '#666',
                                    fontWeight: '600'
                                }}>
                                    {content.length}
                                </span>
                                / 2000
                            </span>
                        </div>
                        {error && (
                            <div style={{
                                marginTop: '12px',
                                padding: '12px',
                                background: '#FEF2F2',
                                border: '1px solid #FECACA',
                                borderRadius: '8px',
                                color: '#DC2626',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>⚠️</span> {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modern Footer */}
                <div style={{
                    padding: '24px 32px',
                    background: 'white',
                    borderTop: '1px solid #e8e8e8',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                }}>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '12px',
                            border: '2px solid #e0e0e0',
                            background: 'white',
                            color: '#666',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (!isSubmitting) {
                                e.currentTarget.style.background = '#f8f9fa';
                                e.currentTarget.style.borderColor = '#d0d0d0';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = '#e0e0e0';
                        }}
                    >
                        Annulla
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || content.trim().length < 20}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #0D475D 0%, #1a5f7a 100%)',
                            color: 'white',
                            cursor: (isSubmitting || content.trim().length < 20) ? 'not-allowed' : 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(13, 71, 93, 0.3)',
                            opacity: (isSubmitting || content.trim().length < 20) ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!isSubmitting && content.trim().length >= 20) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(13, 71, 93, 0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 71, 93, 0.3)';
                        }}
                    >
                        {isSubmitting ? 'Invio...' : isEditing ? 'Salva Modifiche' : 'Invia Risposta'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ForumReplyModal;
