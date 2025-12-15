import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleSPIDCallback } from '../services/spid-auth.service';

const SPIDCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            const success = handleSPIDCallback(token);
            if (success) {
                navigate('/home');
            } else {
                navigate('/spid-error');
            }
        } else {
            const error = searchParams.get('message');
            console.error('SPID error:', error);
            navigate('/spid-error');
        }
    }, [searchParams, navigate]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)',
            color: 'white'
        }}>
            <div style={{
                width: '60px',
                height: '60px',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                borderTop: '4px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '20px'
            }}></div>
            <p style={{ fontSize: '18px', fontWeight: '500' }}>Autenticazione in corso...</p>
            <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>Attendere prego</p>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SPIDCallback;
