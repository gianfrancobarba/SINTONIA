import React from 'react';
import type { QuestionnaireData } from '../types/psychologist';
import { getQuestionnaireStatus } from '../types/psychologist';
import '../css/QuestionnaireDetailModal.css';

interface QuestionnaireDetailModalProps {
    questionnaire: QuestionnaireData | null;
    onClose: () => void;
}

interface Question {
    id: string;
    text: string;
    type: 'single' | 'multiple' | 'text' | 'scale';
    options?: string[];
}

interface Answer {
    questionId: string;
    value: string | string[] | number;
}

const QuestionnaireDetailModal: React.FC<QuestionnaireDetailModalProps> = ({
    questionnaire,
    onClose,
}) => {
    if (!questionnaire) return null;

    const status = getQuestionnaireStatus(questionnaire);

    // Mock questions based on questionnaire type
    const getQuestions = (type: string): Question[] => {
        if (type === 'PHQ-9') {
            return [
                {
                    id: 'q1',
                    text: 'Poco interesse o piacere nel fare le cose',
                    type: 'scale',
                    options: ['Per niente', 'Diversi giorni', 'Più della metà dei giorni', 'Quasi ogni giorno']
                },
                {
                    id: 'q2',
                    text: 'Sentirsi giù, depresso o senza speranza',
                    type: 'scale',
                    options: ['Per niente', 'Diversi giorni', 'Più della metà dei giorni', 'Quasi ogni giorno']
                },
                {
                    id: 'q3',
                    text: 'Difficoltà ad addormentarsi o a restare addormentato, o dormire troppo',
                    type: 'scale',
                    options: ['Per niente', 'Diversi giorni', 'Più della metà dei giorni', 'Quasi ogni giorno']
                },
                {
                    id: 'q4',
                    text: 'Sentirsi stanco o avere poca energia',
                    type: 'scale',
                    options: ['Per niente', 'Diversi giorni', 'Più della metà dei giorni', 'Quasi ogni giorno']
                },
                {
                    id: 'q5',
                    text: 'Poco appetito o mangiare troppo',
                    type: 'scale',
                    options: ['Per niente', 'Diversi giorni', 'Più della metà dei giorni', 'Quasi ogni giorno']
                },
            ];
        } else if (type === 'GAD-7') {
            return [
                {
                    id: 'q1',
                    text: 'Sentirsi nervoso, ansioso o molto teso',
                    type: 'scale',
                    options: ['Per niente', 'Diversi giorni', 'Più della metà dei giorni', 'Quasi ogni giorno']
                },
                {
                    id: 'q2',
                    text: 'Non riuscire a fermare o controllare le preoccupazioni',
                    type: 'scale',
                    options: ['Per niente', 'Diversi giorni', 'Più della metà dei giorni', 'Quasi ogni giorno']
                },
                {
                    id: 'q3',
                    text: 'Preoccuparsi troppo di cose diverse',
                    type: 'scale',
                    options: ['Per niente', 'Diversi giorni', 'Più della metà dei giorni', 'Quasi ogni giorno']
                },
            ];
        } else {
            // BDI-II or other
            return [
                {
                    id: 'q1',
                    text: 'Come ti senti ultimamente?',
                    type: 'scale',
                    options: ['Non mi sento triste', 'Mi sento triste', 'Sono sempre triste', 'Sono così triste che non posso sopportarlo']
                },
                {
                    id: 'q2',
                    text: 'Come vedi il futuro?',
                    type: 'scale',
                    options: ['Non sono scoraggiato', 'Mi sento scoraggiato', 'Sento di non avere nulla da aspettarmi', 'Il futuro è senza speranza']
                },
            ];
        }
    };

    // Mock answers - in real implementation, these would come from questionnaire.risposte
    const getMockAnswers = (questions: Question[]): Answer[] => {
        return questions.map((q, index) => ({
            questionId: q.id,
            value: index % 4, // Random scale value 0-3
        }));
    };

    const questions = getQuestions(questionnaire.nomeTipologia);
    const answers = getMockAnswers(questions);

    const getAnswerText = (question: Question, answer: Answer): string => {
        if (question.type === 'scale' && question.options) {
            const value = answer.value as number;
            return question.options[value] || 'N/A';
        }
        return answer.value.toString();
    };

    const getStatusClassName = (status: string) => {
        return `status-badge status-${status.toLowerCase()}`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2 className="modal-title">Dettagli Questionario</h2>
                        <span className={getStatusClassName(status)}>{status}</span>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Chiudi">
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <div className="questionnaire-info">
                        <div className="info-grid">
                            <div className="info-item">
                                <label>ID Questionario:</label>
                                <span>{questionnaire.idQuestionario}</span>
                            </div>
                            <div className="info-item">
                                <label>Tipologia:</label>
                                <span>{questionnaire.nomeTipologia}</span>
                            </div>
                            <div className="info-item">
                                <label>ID Paziente:</label>
                                <span>{questionnaire.idPaziente}</span>
                            </div>
                            <div className="info-item">
                                <label>Data Compilazione:</label>
                                <span>{questionnaire.dataCompilazione}</span>
                            </div>
                            {questionnaire.score !== null && (
                                <div className="info-item">
                                    <label>Punteggio:</label>
                                    <span className="score-value">{questionnaire.score}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="questions-section">
                        <h3 className="section-title">Domande e Risposte</h3>
                        <div className="questions-list">
                            {questions.map((question, index) => {
                                const answer = answers.find(a => a.questionId === question.id);
                                return (
                                    <div key={question.id} className="question-item">
                                        <div className="question-number">Domanda {index + 1}</div>
                                        <div className="question-text">{question.text}</div>
                                        <div className="answer-box">
                                            <label>Risposta del paziente:</label>
                                            <div className="answer-value">
                                                {answer ? getAnswerText(question, answer) : 'Nessuna risposta'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {questionnaire.noteInvalidazione && (
                        <div className="notes-section">
                            <h3 className="section-title">Note Invalidazione</h3>
                            <div className="notes-content">{questionnaire.noteInvalidazione}</div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-close" onClick={onClose}>
                        Chiudi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionnaireDetailModal;
