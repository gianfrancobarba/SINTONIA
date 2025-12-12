import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/QuestionnaireComplete.css';

const QuestionnaireComplete: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/home');
    };

    return (
        <div className="questionnaire-complete">
            <div className="complete-content">
                <h1 className="complete-title">Ottimo lavoro!</h1>
                <p className="complete-message">
                    Hai completato il questionario con successo.
                    Le tue risposte sono state registrate.
                </p>

                <button className="btn-home" onClick={handleGoHome}>
                    Home Page
                </button>
            </div>
        </div>
    );
};

export default QuestionnaireComplete;
