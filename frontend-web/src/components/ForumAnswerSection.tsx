import React from 'react';
import type { ForumAnswer } from '../types/forum';
import { Pencil, Trash2 } from 'lucide-react';
import '../css/ForumAnswerSection.css';

interface ForumAnswerSectionProps {
    answer: ForumAnswer;
    onEdit?: () => void;
    onDelete?: () => void;
    isMyAnswer?: boolean;
}

const ForumAnswerSection: React.FC<ForumAnswerSectionProps> = ({
    answer,
    onEdit,
    onDelete,
    isMyAnswer = false
}) => {
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

    return (
        <div className="forum-answer-section">
            <div className="answer-header">
                <div className="answer-header-left">
                    <svg className="answer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span className="answer-label">
                        {isMyAnswer ? 'La tua risposta' : `Risposta di Dr. ${answer.nomePsicologo} ${answer.cognomePsicologo}`}
                    </span>
                </div>
                {isMyAnswer && onEdit && onDelete && (
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
                            onClick={onDelete}
                            title="Elimina risposta"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className="answer-body">
                <p className="answer-text">{answer.testo}</p>
            </div>

            <div className="answer-footer">
                <span className="answer-separator">•</span>
                <span className="answer-time">{getTimeAgo(answer.dataRisposta)}</span>
            </div>
        </div>
    );
};

export default ForumAnswerSection;
