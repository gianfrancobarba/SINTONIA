import { useSearchParams, useNavigate } from 'react-router-dom';
import '../css/Login.css';

const SpidError = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const rawMessage = searchParams.get('message') || 'Si è verificato un errore sconosciuto.';

    // Rimuovi "Contatta l'amministratore" dal messaggio se presente
    const message = rawMessage.replace(/\.\s*Contatta l['']amministratore\.?/gi, '.').trim();

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '420px' }}>
                {/* Logo */}
                <div className="logo-container">
                    <img src="/sintonia-logo-new.jpg" alt="Sintonia" className="logo-image" />
                </div>

                {/* Titolo */}
                <h1 style={{
                    color: '#D32F2F',
                    fontSize: '28px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    marginTop: '10px',
                    textAlign: 'center'
                }}>
                    Accesso Negato
                </h1>

                {/* Box messaggio errore */}
                <div className="error-message" style={{
                    textAlign: 'center',
                    padding: '16px',
                    marginBottom: '24px',
                    fontSize: '14px',
                    lineHeight: '1.6'
                }}>
                    {message}
                </div>

                {/* Info */}
                <p style={{
                    color: '#888',
                    fontSize: '12px',
                    textAlign: 'center',
                    marginBottom: '24px',
                    lineHeight: '1.5'
                }}>
                    Se ritieni che questo sia un errore, contatta l'amministratore di sistema.
                </p>

                {/* Pulsante */}
                <button
                    onClick={() => navigate('/login')}
                    className="login-button"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    TORNA AL LOGIN
                </button>
            </div>
        </div>
    );
};

export default SpidError;
