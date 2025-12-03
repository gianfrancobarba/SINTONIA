import { useSearchParams, useNavigate } from 'react-router-dom';
import './Home.css'; // Reuse existing styles

const SpidError = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const message = searchParams.get('message') || 'Si è verificato un errore sconosciuto.';

    return (
        <div className="splash-screen" style={{ flexDirection: 'column', gap: '20px', background: '#fff0f0' }}>
            <div style={{ fontSize: '60px' }}>⚠️</div>
            <h1 style={{ color: '#d32f2f', fontSize: '24px' }}>Errore Autenticazione SPID</h1>
            <p style={{ color: '#333', fontSize: '18px', textAlign: 'center', maxWidth: '500px' }}>
                {message}
            </p>
            <button
                className="access-button"
                style={{ background: '#d32f2f' }}
                onClick={() => navigate('/')}
            >
                Torna alla Home
            </button>
        </div>
    );
};

export default SpidError;
