import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { ForumQuestion } from '../types/forum';
import { X } from 'lucide-react';
import '../css/Modal.css';

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
        <div className="modal-overlay-blur" onClick={onClose}>
            <div
                className="modal-card modal-card-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Gradient */}
                <div className="modal-header-gradient">
                    <div className="modal-header-content">
                        <div className="modal-header-text">
                            <h2 className="modal-header-title">
                                {isEditing ? 'Modifica Risposta' : 'Risposta alla domanda'}
                            </h2>
                            <p className="modal-header-subtitle">
                                {isEditing ? 'Aggiorna la tua risposta' : 'Fornisci supporto al paziente'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="modal-close-btn-rounded"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="modal-body-gray modal-body-scrollable">
                    {/* Question Card */}
                    <div className="modal-info-card modal-info-card-full" style={{ marginBottom: '24px', padding: '24px' }}>
                        <div className="modal-info-card-label">
                            Domanda
                        </div>
                        <div style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            margin: '8px 0 12px 0'
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

                    {/* Reply Section */}
                    <div className="modal-form-group">
                        <label htmlFor="reply-textarea" className="modal-form-label">
                            {isEditing ? 'Modifica la tua risposta' : 'Scrivi la tua risposta'}
                        </label>
                        <textarea
                            id="reply-textarea"
                            className="modal-form-textarea"
                            value={content}
                            onChange={handleContentChange}
                            placeholder="Fornisci una risposta di supporto al paziente..."
                            rows={8}
                            disabled={isSubmitting}
                            style={{ minHeight: '150px' }}
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
                            <div className="modal-error-box" style={{ marginTop: '12px' }}>
                                <span>⚠️</span> {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer-actions">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="btn-modal-secondary"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || content.trim().length < 20}
                        className="btn-modal-primary"
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

