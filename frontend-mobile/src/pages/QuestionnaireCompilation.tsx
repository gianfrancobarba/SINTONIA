import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import QuestionCard from '../components/questionnaire/QuestionCard';
import QuestionScale from '../components/questionnaire/QuestionScale';
import ProgressIndicator from '../components/questionnaire/ProgressIndicator';
import { getQuestionario, submitQuestionario } from '../services/questionario.service';
import type { GetQuestionarioDto, Risposta } from '../types/questionario';
import '../css/QuestionnaireCompilation.css';

const QuestionnaireCompilation: React.FC = () => {
    const { idQuestionario } = useParams<{ idQuestionario: string }>();
    const navigate = useNavigate();

    const [questionario, setQuestionario] = useState<GetQuestionarioDto | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string, number>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuestionario = async () => {
            if (!idQuestionario) {
                setError('ID questionario mancante');
                setLoading(false);
                return;
            }

            try {
                const data = await getQuestionario(idQuestionario);
                setQuestionario(data);
            } catch (err) {
                console.error('Error fetching questionario:', err);
                setError('Errore nel caricamento del questionario');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionario();
    }, [idQuestionario]);

    const handleAnswerChange = (value: number) => {
        if (!questionario) return;

        const currentQuestion = questionario.domande[currentQuestionIndex];
        const newAnswers = new Map(answers);
        newAnswers.set(currentQuestion.id, value);
        setAnswers(newAnswers);
    };

    const handleContinue = async () => {
        if (!questionario || !idQuestionario) return;

        const isLastQuestion = currentQuestionIndex === questionario.domande.length - 1;

        if (isLastQuestion) {
            // Submit questionnaire
            setSubmitting(true);
            try {
                const risposte: Risposta[] = Array.from(answers.entries()).map(([idDomanda, valore]) => ({
                    idDomanda,
                    valore,
                }));

                await submitQuestionario(idQuestionario, risposte);
                navigate('/questionario/complete');
            } catch (err) {
                console.error('Error submitting questionario:', err);
                setError('Errore nell\'invio del questionario');
            } finally {
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
    const currentAnswer = answers.get(currentQuestion.id) || null;
    const canContinue = currentAnswer !== null;

    return (
        <div className="questionnaire-compilation">
            <header className="questionnaire-header">
                <button className="back-button" onClick={handleBack} aria-label="Indietro">
                    <ArrowLeft size={24} />
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
                    minValue={currentQuestion.scalaMin || 1}
                />

                <button
                    className="btn-continue"
                    onClick={handleContinue}
                    disabled={!canContinue || submitting}
                >
                    {submitting ? 'Invio...' : 'Continua'}
                </button>
            </div>
        </div>
    );
};

export default QuestionnaireCompilation;
