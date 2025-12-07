import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LeftArrowIcon from '../assets/icons/LeftArrow.svg';
import QuestionCard from '../components/QuestionCard.tsx';
import QuestionScale from '../components/QuestionScale.tsx';
import ProgressIndicator from '../components/ProgressIndicator.tsx';
import type { GetQuestionarioDto, Risposta } from '../types/questionario';
import Toast from '../components/Toast';
import '../css/QuestionnaireCompilation.css';

const QuestionnaireCompilation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [questionario, setQuestionario] = useState<GetQuestionarioDto | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string, number>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        // Load questionnaire data from navigation state
        const state = location.state as { questionario: GetQuestionarioDto } | undefined;

        if (!state?.questionario) {
            setError('Nessun questionario da compilare. Torna alla lista.');
            setLoading(false);
            return;
        }

        if (!state.questionario.domande || state.questionario.domande.length === 0) {
            setError('Il questionario non contiene domande.');
            setLoading(false);
            return;
        }

        setQuestionario(state.questionario);
        setLoading(false);
    }, [location.state]);

    const handleAnswerChange = (value: number) => {
        if (!questionario) return;

        const currentQuestion = questionario.domande[currentQuestionIndex];
        const newAnswers = new Map(answers);
        newAnswers.set(currentQuestion.id, value);
        setAnswers(newAnswers);
    };

    const handleContinue = async () => {
        if (!questionario) return;

        const isLastQuestion = currentQuestionIndex === questionario.domande.length - 1;

        if (isLastQuestion) {
            // Submit questionnaire - send to backend for scoring and save
            setSubmitting(true);
            try {
                const risposte: Risposta[] = Array.from(answers.entries()).map(([idDomanda, valore]) => ({
                    idDomanda,
                    valore,
                }));

                // Submit to backend - it will calculate score and save
                const token = localStorage.getItem('patient_token');
                const response = await fetch('http://localhost:3000/paziente/questionario/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        nomeTipologia: questionario.nomeTipologia,
                        risposte: risposte,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                await response.json();

                setShowToast(true);
                setTimeout(() => {
                    navigate('/questionari');
                }, 2000);
            } catch (err) {
                console.error('Error submitting questionario:', err);
                setError('Errore nell\'invio del questionario');
                setSubmitting(false);
            }
        } else {
            // Move to next question
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else {
            navigate(-1);
        }
    };

    if (loading) {
        return <div className="loading-screen">Caricamento...</div>;
    }

    if (error || !questionario) {
        return (
            <div className="error-screen">
                <p>{error || 'Errore nel caricamento del questionario'}</p>
                <button onClick={() => navigate('/home')} className="btn-primary">
                    Torna alla Home
                </button>
            </div>
        );
    }

    const currentQuestion = questionario.domande[currentQuestionIndex];
    const currentAnswer = answers.get(currentQuestion.id) ?? null;
    const canContinue = currentAnswer !== null;

    return (
        <div className="questionnaire-compilation">
            <header className="questionnaire-header">
                <button className="back-button" onClick={handleBack} aria-label="Indietro">
                    <img src={LeftArrowIcon} alt="Back" />
                </button>
                <h1 className="questionnaire-title">{questionario.nomeTipologia}</h1>
                <ProgressIndicator
                    current={currentQuestionIndex + 1}
                    total={questionario.domande.length}
                />
            </header>

            <div className="questionnaire-content">
                <QuestionCard question={currentQuestion} />

                <QuestionScale
                    value={currentAnswer}
                    onChange={handleAnswerChange}
                    maxValue={currentQuestion.scalaMax || 5}
                    minValue={currentQuestion.scalaMin ?? 0}
                    labels={currentQuestion.opzioni}
                />

                <button
                    className="btn-continue"
                    onClick={handleContinue}
                    disabled={!canContinue || submitting}
                >
                    {submitting ? 'Invio...' : 'Continua'}
                </button>
            </div>

            {showToast && (
                <Toast
                    message="Questionario inviato con successo!"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
};

export default QuestionnaireCompilation;
