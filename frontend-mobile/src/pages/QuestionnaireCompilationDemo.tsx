import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import QuestionCard from '../components/questionnaire/QuestionCard';
import QuestionScale from '../components/questionnaire/QuestionScale';
import ProgressIndicator from '../components/questionnaire/ProgressIndicator';
import type { Domanda } from '../types/questionario';
import '../css/QuestionnaireCompilation.css';

// DATI MOCK PER TESTING
const mockQuestionario = {
    idQuestionario: 'test-123',
    nomeTipologia: 'WHO-5',
    tempoSomministrazione: 5,
    domande: [
        {
            id: '1',
            testo: 'Mi sono sentito/a allegro/a e di buon umore',
            tipo: 'scala' as const,
            scalaMin: 1,
            scalaMax: 5,
        },
        {
            id: '2',
            testo: 'Mi sono sentito/a calmo/a e rilassato/a',
            tipo: 'scala' as const,
            scalaMin: 1,
            scalaMax: 5,
        },
        {
            id: '3',
            testo: 'Mi sono sentito/a attivo/a e vigoroso/a',
            tipo: 'scala' as const,
            scalaMin: 1,
            scalaMax: 5,
        },
        {
            id: '4',
            testo: 'Mi sono svegliato/a sentendomi fresco/a e riposato/a',
            tipo: 'scala' as const,
            scalaMin: 1,
            scalaMax: 5,
        },
        {
            id: '5',
            testo: 'La mia vita quotidiana è stata piena di cose interessanti',
            tipo: 'scala' as const,
            scalaMin: 1,
            scalaMax: 5,
        },
    ] as Domanda[],
};

const QuestionnaireCompilationDemo: React.FC = () => {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string, number>>(new Map());

    const handleAnswerChange = (value: number) => {
        const currentQuestion = mockQuestionario.domande[currentQuestionIndex];
        const newAnswers = new Map(answers);
        newAnswers.set(currentQuestion.id, value);
        setAnswers(newAnswers);
    };

    const handleContinue = () => {
        const isLastQuestion = currentQuestionIndex === mockQuestionario.domande.length - 1;

        if (isLastQuestion) {
            console.log('Risposte inviate:', Object.fromEntries(answers));
            navigate('/questionario/complete');
        } else {
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

    const currentQuestion = mockQuestionario.domande[currentQuestionIndex];
    const currentAnswer = answers.get(currentQuestion.id) || null;
    const canContinue = currentAnswer !== null;

    return (
        <div className="questionnaire-compilation">
            <header className="questionnaire-header">
                <button className="back-button" onClick={handleBack} aria-label="Indietro">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="questionnaire-title">{mockQuestionario.nomeTipologia}</h1>
                <ProgressIndicator
                    current={currentQuestionIndex + 1}
                    total={mockQuestionario.domande.length}
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
                    disabled={!canContinue}
                >
                    Continua
                </button>
            </div>
        </div>
    );
};

export default QuestionnaireCompilationDemo;
