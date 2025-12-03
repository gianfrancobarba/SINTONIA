import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/InitialQuestionnairesModal.css';

interface InitialQuestionnairesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InitialQuestionnairesModal: React.FC<InitialQuestionnairesModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleGoToQuestionnaires = () => {
        onClose();
        navigate('/questionari');
    };

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
                        Completa <strong>4 questionari</strong> per valutare il tuo benessere
                    </p>

                    <div className="questionnaire-grid">
                        <div className="grid-item phq9">
                            <div className="grid-icon-wrapper">
                                <svg className="grid-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <path d="M8 12H16M8 8H16M8 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <strong>PHQ-9</strong>
                        </div>

                        <div className="grid-item gad7">
                            <div className="grid-icon-wrapper">
                                <svg className="grid-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <strong>GAD-7</strong>
                        </div>

                        <div className="grid-item who5">
                            <div className="grid-icon-wrapper">
                                <svg className="grid-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <strong>WHO-5</strong>
                        </div>

                        <div className="grid-item pcptsd5">
                            <div className="grid-icon-wrapper">
                                <svg className="grid-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <strong>PC-PTSD-5</strong>
                        </div>
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
