import React from 'react';
import type { ForumQuestion } from '../types/forum';
import ForumAnswerSection from './ForumAnswerSection.tsx';
import '../css/ForumQuestionCard.css';

interface ForumQuestionCardProps {
    question: ForumQuestion;
    onAnswer: (questionId: string) => void;
    onEditAnswer?: (answerId: string, currentText: string) => void;
    onDeleteAnswer?: (answerId: string) => void;
}

const ForumQuestionCard: React.FC<ForumQuestionCardProps> = ({
    question,
    onAnswer,
    onEditAnswer,
    onDeleteAnswer
}) => {
    const getCategoryColor = (categoria: string): string => {
        const colors: Record<string, string> = {
            'Ansia': '#8b5cf6',
            'Stress': '#f97316',
            'Tristezza': '#eab308',
            'Vita di coppia': '#ec4899',
            'Altro': '#10b981'
        };
        return colors[categoria] || '#6b7280';
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

    return (
        <div className="forum-question-card">
            <div className="card-header">
                <div className="header-left">
                    <span
                        className="category-badge"
                        style={{ backgroundColor: getCategoryColor(question.categoria) }}
                    >
                        {question.categoria}
                    </span>
                    <h3 className="question-title">{question.titolo}</h3>
                </div>
                <div className="header-right">
                    <span className="patient-name">Anonimo</span>
                    <span className="time-ago">{getTimeAgo(question.dataInserimento)}</span>
                </div>
            </div>

            <div className="card-body">
                <p className="question-text">{question.testo}</p>
            </div>

            {question.hasAnswer && question.risposta ? (
                <ForumAnswerSection
                    answer={question.risposta}
                    onEdit={() => onEditAnswer?.(question.risposta!.idRisposta, question.risposta!.testo)}
                    onDelete={() => onDeleteAnswer?.(question.risposta!.idRisposta)}
                />
            ) : (
                <div className="card-footer">
                    <button
                        className="answer-button"
                        onClick={() => onAnswer(question.idDomanda)}
                    >
                        💬 Rispondi
                    </button>
                </div>
            )}
        </div>
    );
};

export default ForumQuestionCard;
