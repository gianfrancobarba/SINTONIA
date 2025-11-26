import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleSpidToken } from '../services/auth.service';

const SpidCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            try {
                handleSpidToken(token);
                navigate('/dashboard');
            } catch (error) {
                console.error('Error handling SPID token:', error);
                navigate('/login?error=spid_auth_failed');
            }
        } else {
            navigate('/login?error=no_token');
        }
    }, [searchParams, navigate]);

    return (
        <div className="login-container">
            <div className="login-card" style={{ textAlign: 'center', padding: '40px' }}>
                <h2>Accesso in corso...</h2>
                <p>Stiamo verificando la tua identità SPID.</p>
            </div>
        </div>
    );
};

export default SpidCallback;
