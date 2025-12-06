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
            background: '#0066CC',
            color: 'white',
            textAlign: 'center'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '40px 30px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '20px'
                }}>
                    ⚠️
                </div>

                <h1 style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    color: '#333'
                }}>
                    Errore di Accesso
                </h1>

                <p style={{
                    fontSize: '15px',
                    lineHeight: '1.6',
                    marginBottom: '30px',
                    color: '#555'
                }}>
                    {message}
                </p>

                <button
                    onClick={() => navigate('/spid-info')}
                    style={{
                        padding: '14px 28px',
                        borderRadius: '25px',
                        border: 'none',
                        background: '#0066CC',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        width: '100%',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    Riprova
                </button>

                <a
                    href="https://www.spid.gov.it/ottieni-assistenza-dagli-identity-provider/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'block',
                        fontSize: '13px',
                        color: '#0066CC',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}
                >
                    Serve aiuto?
                </a>
            </div>
        </div>
    );
};

export default SPIDError;
