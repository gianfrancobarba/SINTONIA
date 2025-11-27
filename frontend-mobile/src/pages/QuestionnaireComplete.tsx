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
                <h1 className="complete-title">Questionario Compilato!</h1>
                <p className="complete-message">
                    Congratulazioni hai terminato la compilazione di questo questionario!
                </p>

                <div className="complete-illustration">
                    <img
                        src="/celebration-illustration.png"
                        alt="Celebrazione"
                        className="illustration-image"
                    />
                </div>

                <button className="btn-home" onClick={handleGoHome}>
                    Home Page
                </button>
            </div>
        </div>
    );
};

export default QuestionnaireComplete;
