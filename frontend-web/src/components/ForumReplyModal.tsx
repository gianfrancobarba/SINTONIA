import React, { useState, useEffect } from 'react';
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

    return (
        <div className="forum-reply-modal-overlay" onClick={onClose}>
            <div className="forum-reply-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-header-content">
                        <svg className="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <div className="modal-header-text">
                            <h2>{isEditing ? 'Modifica Risposta' : 'Risposta alla domanda'}</h2>
                            <p className="modal-subtitle">{isEditing ? 'Aggiorna la tua risposta professionale' : 'Fornisci supporto al paziente'}</p>
                        </div>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="question-preview">
                        <div className="preview-label">Domanda:</div>
                        <div className="preview-title">{question.titolo}</div>
                        <div className="preview-text">{question.testo}</div>
                    </div>

                    <div className="reply-section">
                        <label htmlFor="reply-textarea" className="reply-label">
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
                        />
                        <div className="character-count">
                            <span className={content.length < 20 ? 'text-danger' : content.length > 2000 ? 'text-danger' : ''}>
                                {content.length}
                            </span>
                            {' / 2000 caratteri'}
                            {content.length < 20 && (
                                <span className="min-chars-hint"> (minimo 20 caratteri)</span>
                            )}
                        </div>
                        {error && <div className="error-message">{error}</div>}
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="cancel-modal-button"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Annulla
                    </button>
                    <button
                        className="submit-modal-button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || content.trim().length < 20}
                    >
                        {isSubmitting ? 'Invio...' : isEditing ? 'Salva Modifiche' : 'Invia Risposta'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForumReplyModal;
