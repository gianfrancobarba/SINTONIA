import React, { useState } from 'react';
import type { ForumAnswer } from '../types/forum';
import { Pencil, Trash2 } from 'lucide-react';
import '../css/ForumAnswerSection.css';

interface ForumAnswerSectionProps {
    answer: ForumAnswer;
    onEdit?: () => void;
    onDelete?: () => void;
    isMyAnswer?: boolean;
}

const TEXT_TRUNCATE_LENGTH = 150;

const ForumAnswerSection: React.FC<ForumAnswerSectionProps> = ({
    answer,
    onEdit,
    onDelete,
    isMyAnswer = false
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [imageError, setImageError] = useState(false);

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

    const getProfileImageUrl = (): string | null => {
        if (answer.immagineProfilo) {
            if (answer.immagineProfilo.startsWith('data:image')) {
                return answer.immagineProfilo;
            }
            return `http://localhost:3000${answer.immagineProfilo}`;
        }
        return null;
    };

    const getInitials = (): string => {
        const first = answer.nomePsicologo?.charAt(0) || '';
        const last = answer.cognomePsicologo?.charAt(0) || '';
        return `${first}${last}`.toUpperCase();
    };

    const isTextLong = answer.testo.length > TEXT_TRUNCATE_LENGTH;
    const displayText = isTextLong && !isExpanded
        ? answer.testo.slice(0, TEXT_TRUNCATE_LENGTH) + '...'
        : answer.testo;

    const profileImage = getProfileImageUrl();
    const showInitials = !profileImage || imageError;

    return (
        <div className="forum-answer-section">
            <div className="answer-header">
                <div className="answer-author-info">
                    <div className="author-avatar">
                        {showInitials ? (
                            <span className="avatar-initials">{getInitials()}</span>
                        ) : (
                            <img
                                src={profileImage!}
                                alt=""
                                onError={() => setImageError(true)}
                            />
                        )}
                    </div>
                    <div className="author-details">
                        <span className="author-name">
                            Dr. {answer.nomePsicologo} {answer.cognomePsicologo}
                        </span>
                        <span className="answer-time">{getTimeAgo(answer.dataRisposta)}</span>
                    </div>
                </div>
                {isMyAnswer && onEdit && onDelete && (
                    <div className="answer-actions">
                        <button
                            className="action-button edit-button"
                            onClick={onEdit}
                            title="Modifica risposta"
                        >
                            <Pencil size={14} />
                        </button>
                        <button
                            className="action-button delete-button"
                            onClick={onDelete}
                            title="Elimina risposta"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            <div className="answer-body">
                <p className="answer-text">{displayText}</p>
                {isTextLong && (
                    <button
                        className="expand-text-button"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Mostra meno' : 'Mostra di più'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ForumAnswerSection;
