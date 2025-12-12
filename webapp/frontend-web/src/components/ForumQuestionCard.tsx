import React, { useState } from 'react';
import type { ForumQuestion } from '../types/forum';
import ForumAnswerSection from './ForumAnswerSection.tsx';
import { getCurrentUser } from '../services/auth.service';
import { Send, X } from 'lucide-react';
import '../css/ForumQuestionCard.css';

interface ForumQuestionCardProps {
    question: ForumQuestion;
    onSubmitAnswer?: (questionId: string, content: string) => Promise<void>;
    onEditAnswer?: (answerId: string, currentText: string) => void;
    onDeleteAnswer?: (answerId: string) => void;
    editingAnswerId?: string | null;
    editingContent?: string;
    onEditSubmit?: (answerId: string, content: string) => Promise<void>;
    onEditCancel?: () => void;
    onEditContentChange?: (content: string) => void;
}

const ForumQuestionCard: React.FC<ForumQuestionCardProps> = ({
    question,
    onSubmitAnswer,
    onEditAnswer,
    onDeleteAnswer,
    editingAnswerId,
    editingContent = '',
    onEditSubmit,
    onEditCancel,
    onEditContentChange
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTextExpanded, setIsTextExpanded] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const TEXT_TRUNCATE_LENGTH = 200;

    const getCategoryColor = (categoria: string): string => {
        const colors: Record<string, string> = {
            'Ansia': '#eab308',
            'Stress': '#D32F2F',
            'Tristezza': '#8B5CF6',
            'Vita di Coppia': '#ec4899',
        };
        return colors[categoria] || '#61A889';
    };

    const getTimeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins}m fa`;
        } else if (diffHours < 24) {
            return `${diffHours}h fa`;
        } else {
            return `${diffDays}g fa`;
        }
    };

    const displayedAnswers = question.risposte && question.risposte.length > 0
        ? question.risposte
        : [];

    const isTextLong = question.testo.length > TEXT_TRUNCATE_LENGTH;
    const displayText = isTextLong && !isTextExpanded
        ? question.testo.slice(0, TEXT_TRUNCATE_LENGTH) + '...'
        : question.testo;

    const handleSubmitReply = async () => {
        if (replyContent.trim().length < 50) {
            setError('La risposta deve contenere almeno 50 caratteri');
            return;
        }
        if (replyContent.trim().length > 2000) {
            setError('La risposta non può superare i 2000 caratteri');
            return;
        }

        setIsSubmitting(true);
        setError('');
        try {
            await onSubmitAnswer?.(question.idDomanda, replyContent.trim());
            setReplyContent('');
            setShowReplyForm(false);
        } catch (err) {
            setError('Errore durante l\'invio della risposta');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelReply = () => {
        setShowReplyForm(false);
        setReplyContent('');
        setError('');
    };

    const currentUser = getCurrentUser();
    const hasMyAnswer = question.risposte?.some(a => a.idPsicologo === currentUser?.fiscalCode);

    return (
        <div className="forum-question-card">
            <div className="card-header">
                <div className="header-left">
                    <div className="category-indicator">
                        <span
                            className="category-dot"
                            style={{ backgroundColor: getCategoryColor(question.categoria) }}
                        />
                        <span className="category-label">{question.categoria}</span>
                    </div>
                    <h3 className="question-title">{question.titolo}</h3>
                </div>
                <div className="header-right">
                    <span className="patient-name">Anonimo</span>
                    <span className="time-ago">{getTimeAgo(question.dataInserimento)}</span>
                </div>
            </div>

            <div className="card-body">
                <p className="question-text">{displayText}</p>
                {isTextLong && (
                    <button
                        className="expand-text-button"
                        onClick={() => setIsTextExpanded(!isTextExpanded)}
                    >
                        {isTextExpanded ? 'Mostra meno' : 'Mostra di più'}
                    </button>
                )}
            </div>

            {question.risposte && question.risposte.length > 0 && (
                <div className="answers-section">
                    {!isExpanded ? (
                        <button
                            className="toggle-answers-button collapsed-toggle"
                            onClick={() => setIsExpanded(true)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            {question.risposte.length} {question.risposte.length === 1 ? 'risposta' : 'risposte'} – Visualizza
                        </button>
                    ) : (
                        <div className="answers-list">
                            {displayedAnswers.map(answer => {
                                const isMyAnswer = !!(currentUser && answer.idPsicologo === currentUser.fiscalCode);
                                const isEditingThis = editingAnswerId === answer.idRisposta;

                                if (isEditingThis) {
                                    return (
                                        <div key={answer.idRisposta} className="inline-reply-form">
                                            <textarea
                                                className="inline-reply-textarea"
                                                value={editingContent}
                                                onChange={(e) => onEditContentChange?.(e.target.value)}
                                                placeholder="Modifica la tua risposta..."
                                                rows={4}
                                                maxLength={2000}
                                            />
                                            <div className="inline-reply-footer">
                                                <span className="char-count">
                                                    {editingContent.length}/2000
                                                </span>
                                                <div className="inline-reply-actions">
                                                    <button
                                                        className="inline-cancel-btn"
                                                        onClick={onEditCancel}
                                                    >
                                                        <X size={16} />
                                                        Annulla
                                                    </button>
                                                    <button
                                                        className="inline-submit-btn"
                                                        onClick={() => onEditSubmit?.(answer.idRisposta, editingContent)}
                                                        disabled={editingContent.trim().length < 50 || editingContent.length > 2000}
                                                    >
                                                        <Send size={16} />
                                                        Salva
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <ForumAnswerSection
                                        key={answer.idRisposta}
                                        answer={answer}
                                        isMyAnswer={isMyAnswer}
                                        onEdit={isMyAnswer ? () => onEditAnswer?.(answer.idRisposta, answer.testo) : undefined}
                                        onDelete={isMyAnswer ? () => onDeleteAnswer?.(answer.idRisposta) : undefined}
                                    />
                                );
                            })}

                            <button
                                className="toggle-answers-button"
                                onClick={() => setIsExpanded(false)}
                            >
                                Nascondi risposte
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Inline Reply Form */}
            {showReplyForm && (
                <div className="inline-reply-form">
                    <textarea
                        className="inline-reply-textarea"
                        value={replyContent}
                        onChange={(e) => {
                            setReplyContent(e.target.value);
                            setError('');
                        }}
                        placeholder="Scrivi la tua risposta..."
                        rows={4}
                        maxLength={2000}
                        disabled={isSubmitting}
                        autoFocus
                    />
                    {error && <div className="inline-reply-error">{error}</div>}
                    <div className="inline-reply-footer">
                        <span className="char-count" style={{
                            color: replyContent.length < 50 || replyContent.length >= 2000 ? '#E57373' : '#666'
                        }}>
                            {replyContent.length}/2000 {replyContent.length > 0 && replyContent.length < 50 && '(min 50)'}
                        </span>
                        <div className="inline-reply-actions">
                            <button
                                className="inline-cancel-btn"
                                onClick={handleCancelReply}
                                disabled={isSubmitting}
                            >
                                <X size={16} />
                                Annulla
                            </button>
                            <button
                                className="inline-submit-btn"
                                onClick={handleSubmitReply}
                                disabled={isSubmitting || replyContent.trim().length < 50 || replyContent.length > 2000}
                            >
                                <Send size={16} />
                                {isSubmitting ? 'Invio...' : 'Invia'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reply Button - only show if not already replying and user hasn't answered */}
            {!showReplyForm && !hasMyAnswer && onSubmitAnswer && (
                <div className="card-footer">
                    <button
                        className="answer-button"
                        onClick={() => setShowReplyForm(true)}
                    >
                        <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Rispondi
                    </button>
                </div>
            )}
        </div>
    );
};

export default ForumQuestionCard;
