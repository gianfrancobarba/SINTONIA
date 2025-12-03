import React from 'react';
import type { ForumQuestion } from '../types/forum';
import ForumAnswerSection from './ForumAnswerSection.tsx';
import { getCurrentUser } from '../services/auth.service';
import '../css/ForumQuestionCard.css';

interface ForumQuestionCardProps {
    question: ForumQuestion;
    onAnswer?: (questionId: string) => void;
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

    const [isExpanded, setIsExpanded] = React.useState(false);
    const ANSWERS_THRESHOLD = 2;

    const displayedAnswers = question.risposte && question.risposte.length > 0
        ? (isExpanded ? question.risposte : question.risposte.slice(0, ANSWERS_THRESHOLD))
        : [];

    const hasMoreAnswers = question.risposte && question.risposte.length > ANSWERS_THRESHOLD;

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

            {question.risposte && question.risposte.length > 0 && (
                <div className="answers-list">
                    {displayedAnswers.map(answer => {
                        const currentUser = getCurrentUser();
                        const isMyAnswer = !!(currentUser && answer.idPsicologo === currentUser.id);

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

                    {hasMoreAnswers && (
                        <button
                            className="toggle-answers-button"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded
                                ? 'Mostra meno'
                                : `Mostra altre ${question.risposte.length - ANSWERS_THRESHOLD} risposte`
                            }
                        </button>
                    )}
                </div>
            )}

            {(!question.risposte || !question.risposte.some(a => {
                const currentUser = getCurrentUser();
                return currentUser && a.idPsicologo === currentUser.id;
            })) && onAnswer && (
                    <div className="card-footer">
                        <button
                            className="answer-button"
                            onClick={() => onAnswer(question.idDomanda)}
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