import { useSearchParams, useNavigate } from 'react-router-dom';
import '../css/SPIDError.css';

const SPIDError = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const message = searchParams.get('message') || "Si è verificato un errore durante l'autenticazione.";

    // Detect if this is an "already assigned" or "account disabled" message
    const isInfoMessage = message.includes('già in cura') || message.includes('assegnato');
    const isAccountDisabled = message.includes('concluso') || message.includes('terminat');

    // Determine icon and title based on message type
    const getIconAndTitle = () => {
        if (isInfoMessage) {
            return {
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                ),
                title: 'Sei già in cura',
                iconVariant: 'info-variant'
            };
        }
        if (isAccountDisabled) {
            return {
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                ),
                title: 'Percorso Concluso',
                iconVariant: ''
            };
        }
        return {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
            ),
            title: 'Errore di Accesso',
            iconVariant: ''
        };
    };

    const { icon, title, iconVariant } = getIconAndTitle();

    return (
        <div className="spid-error-container">
            <div className="spid-error-card">
                {/* Logo */}
                <img
                    src="/sintonia-logo-new.jpg"
                    alt="Sintonia"
                    className="error-logo"
                />

                {/* Icon */}
                <div className={`error-icon-container ${iconVariant}`}>
                    {icon}
                </div>

                {/* Title */}
                <h1 className="error-title">{title}</h1>

                {/* Message */}
                <div className="spid-error-message-container">
                    <p className="spid-error-message">{message}</p>
                </div>

                {/* Primary Action */}
                <button
                    onClick={() => navigate('/spid-info')}
                    className="error-btn-primary"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Riprova l'accesso
                </button>
                {/* Footer */}
                <div className="error-footer">
                    <a
                        href="https://sinfonia.regione.campania.it/assistenza"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="error-link-secondary"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        Hai bisogno di aiuto?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SPIDError;
