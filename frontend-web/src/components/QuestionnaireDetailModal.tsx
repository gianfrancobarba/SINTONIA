import React, { useState } from 'react';
import type { QuestionnaireData } from '../types/psychologist';
import '../css/QuestionnaireDetailModal.css';

interface QuestionnaireDetailModalProps {
    questionnaire: QuestionnaireData | null;
    onClose: () => void;
    role?: 'psychologist' | 'admin';
    onRequestInvalidation?: (id: string, notes: string) => void;
    onReview?: (id: string) => void;
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
    role = 'psychologist',
    onRequestInvalidation,
    onReview,
}) => {
    if (!questionnaire) return null;

    const [invalidationNotes, setInvalidationNotes] = useState<string>('');
    const [isReviewing, setIsReviewing] = useState(false);

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

    const handleReview = async () => {
        if (window.confirm('Sei sicuro di voler revisionare questo questionario?')) {
            setIsReviewing(true);
            try {
                await onReview?.(questionnaire.idQuestionario);
                onClose();
            } catch (error) {
                console.error('Failed to review questionnaire', error);
                alert('Errore durante la revisione del questionario');
            } finally {
                setIsReviewing(false);
            }
        }
    };



    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2 className="modal-title">Dettagli Questionario</h2>
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
                                <label>Data Compilazione:</label>
                                <span>{new Date(questionnaire.dataCompilazione).toLocaleString('it-IT', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
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

                    {role === 'psychologist' && (
                        <div className="invalidation-request-section">
                            <h3 className="section-title">Richiesta Invalidazione</h3>
                            <div className="invalidation-form">
                                <textarea
                                    className="invalidation-textarea"
                                    placeholder="Inserisci il motivo della richiesta di invalidazione..."
                                    value={invalidationNotes}
                                    onChange={(e) => setInvalidationNotes(e.target.value)}
                                    rows={4}
                                />
                                <button
                                    className="btn-request-invalidation"
                                    onClick={() => {
                                        if (invalidationNotes.trim()) {
                                            onRequestInvalidation?.(questionnaire.idQuestionario, invalidationNotes);
                                            setInvalidationNotes('');
                                            onClose();
                                        }
                                    }}
                                    disabled={!invalidationNotes.trim()}
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{ marginRight: '8px', verticalAlign: 'middle' }}
                                    >
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <path d="M12 18v-6" />
                                        <path d="M9 15l3 3 3-3" />
                                    </svg>
                                    Richiedi Invalidazione
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {role === 'psychologist' && (
                        <button
                            className="btn-review"
                            onClick={handleReview}
                            disabled={isReviewing}
                        >
                            {isReviewing ? 'Attendi...' : 'Revisiona'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionnaireDetailModal;
