import React, { useState } from 'react';
import type { ForumAnswer } from '../types/forum';
import { Pencil, Trash2 } from 'lucide-react';
import '../css/ForumAnswerSection.css';

interface ForumAnswerSectionProps {
    answer: ForumAnswer;
    onEdit: () => void;
    onDelete: () => void;
}

const ForumAnswerSection: React.FC<ForumAnswerSectionProps> = ({
    answer,
    onEdit,
    onDelete
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    const handleDelete = () => {
        setShowDeleteConfirm(false);
        onDelete();
    };

    return (
        <div className="forum-answer-section">
            <div className="answer-header">
                <div className="answer-header-left">
                    <span className="answer-icon">💬</span>
                    <span className="answer-label">Tua Risposta</span>
                </div>
                <div className="answer-actions">
                    <button
                        className="action-button edit-button"
                        onClick={onEdit}
                        title="Modifica risposta"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        className="action-button delete-button"
                        onClick={() => setShowDeleteConfirm(true)}
                        title="Elimina risposta"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="answer-body">
                <p className="answer-text">{answer.testo}</p>
            </div>

            <div className="answer-footer">
                <span className="answer-author">{answer.psychologistName}</span>
                <span className="answer-separator">•</span>
                <span className="answer-time">{getTimeAgo(answer.dataRisposta)}</span>
            </div>

            {showDeleteConfirm && (
                <div className="delete-confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <h3>Conferma eliminazione</h3>
                        <p>Sei sicuro di voler eliminare questa risposta? L'azione non può essere annullata.</p>
                        <div className="delete-confirm-actions">
                            <button
                                className="cancel-button"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Annulla
                            </button>
                            <button
                                className="confirm-delete-button"
                                onClick={handleDelete}
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForumAnswerSection;
