import { useSearchParams, useNavigate } from 'react-router-dom';

const SPIDError = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const message = searchParams.get('message') || "Si è verificato un errore durante l'autenticazione.";

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '20px',
            background: 'linear-gradient(135deg, #0f3e4d 0%, #0f3e4d 100%)',
            color: 'white',
            textAlign: 'center'
        }}>
            <div style={{
                fontSize: '48px',
                marginBottom: '20px'
            }}>
                ⚠️
            </div>

            <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '16px'
            }}>
                Errore di Accesso
            </h1>

            <p style={{
                fontSize: '16px',
                lineHeight: '1.5',
                marginBottom: '40px',
                maxWidth: '300px',
                opacity: 0.9
            }}>
                {message}
            </p>

            <button
                onClick={() => navigate('/')}
                style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'white',
                    color: '#0f3e4d',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            >
                Torna alla Home
            </button>
        </div>
    );
};

export default SPIDError;
