import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/InitialQuestionnairesModal.css';

interface InitialQuestionnairesModalProps {
    isOpen: boolean;
    onClose: () => void;
    pendingQuestionnaires: string[];
}

// Mapping of questionnaire names to their display data
// Icons are semantically appropriate for each clinical questionnaire type
const QUESTIONNAIRE_CONFIG: Record<string, { className: string; icon: React.ReactNode }> = {
    'PHQ-9': {
        className: 'phq9',

        icon: (
            // Brain/mind icon - represents mental health/depression screening
            <svg className="grid-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C10.5 4.5 9.25 5 8.5 6C7.5 5.5 6 5.5 5 6.5C4 7.5 4 9 4.5 10C3.5 11 3.5 12.5 4.5 13.5C4 14.5 4 16 5 17C6 18 7.5 18 8.5 17.5C9.25 18.5 10.5 19 12 19C13.5 19 14.75 18.5 15.5 17.5C16.5 18 18 18 19 17C20 16 20 14.5 19.5 13.5C20.5 12.5 20.5 11 19.5 10C20 9 20 7.5 19 6.5C18 5.5 16.5 5.5 15.5 6C14.75 5 13.5 4.5 12 4.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        )
    },
    'GAD-7': {
        className: 'gad7',

        icon: (
            // Heart with pulse - represents anxiety/heart rate
            <svg className="grid-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6C12 6 8.5 2 5 5C1.5 8 4 12 12 20C20 12 22.5 8 19 5C15.5 2 12 6 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12H8L10 9L12 15L14 11L16 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    'WHO-5': {
        className: 'who5',
        icon: (
            // Smile face - represents wellbeing/happiness
            <svg className="grid-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="9" cy="10" r="1" fill="currentColor" />
                <circle cx="15" cy="10" r="1" fill="currentColor" />
            </svg>
        )
    },
    'PC-PTSD-5': {
        className: 'pcptsd5',

        icon: (
            // Shield icon - represents protection/trauma screening
            <svg className="grid-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L4 7V12C4 16.5 7.5 20.5 12 21.5C16.5 20.5 20 16.5 20 12V7L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="15" r="1" fill="currentColor" />
            </svg>
        )
    }
};

const InitialQuestionnairesModal: React.FC<InitialQuestionnairesModalProps> = ({ isOpen, onClose, pendingQuestionnaires }) => {
    const navigate = useNavigate();

    // Don't render if not open or no pending questionnaires
    if (!isOpen || pendingQuestionnaires.length === 0) return null;

    const handleGoToQuestionnaires = () => {
        onClose();
        navigate('/questionari');
    };

    const questionnaireCount = pendingQuestionnaires.length;
    const questionnaireWord = questionnaireCount === 1 ? 'questionario' : 'questionari';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Decorative header gradient */}
                <div className="modal-header-decoration"></div>

                <div className="modal-header">
                    <div className="header-icon-wrapper">
                        <svg className="header-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h2>Screening Iniziale</h2>
                </div>

                <div className="modal-body">
                    <p className="intro-text">
                        Completa <strong>{questionnaireCount} {questionnaireWord}</strong> per valutare il tuo benessere
                    </p>

                    <div className={`questionnaire-grid count-${questionnaireCount}`}>
                        {pendingQuestionnaires.map((name) => {
                            const config = QUESTIONNAIRE_CONFIG[name];
                            if (!config) return null;

                            return (
                                <div key={name} className={`grid-item ${config.className}`}>
                                    <div className="grid-icon-wrapper">
                                        {config.icon}
                                    </div>
                                    <strong>{name}</strong>
                                </div>
                            );
                        })}
                    </div>

                    <div className="info-box">
                        <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <p>Essenziale per fornirti <strong>supporto personalizzato</strong></p>
                    </div>
                </div>

                <div className="modal-actions">
                    <button onClick={handleGoToQuestionnaires} className="btn-primary">
                        Vai ai Questionari
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button onClick={onClose} className="btn-secondary">
                        Ricordamelo dopo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InitialQuestionnairesModal;
