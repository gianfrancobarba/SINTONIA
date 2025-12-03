import React from 'react';
import type { Domanda } from '../types/questionario.ts';
import '../css/QuestionCard.css';

interface QuestionCardProps {
    question: Domanda;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
    return (
        <div className="question-card">
            <h2 className="question-text">{question.testo}</h2>
        </div>
    );
};

export default QuestionCard;
