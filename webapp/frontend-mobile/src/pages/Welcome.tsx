import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Welcome.css';

const Welcome = () => {
    const navigate = useNavigate();
    const [fadeIn, setFadeIn] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Trigger fade in animation
        setTimeout(() => setFadeIn(true), 50);
    }, []);

    const handleAccediClick = () => {
        setFadeOut(true);
        setTimeout(() => {
            navigate('/spid-info');
        }, 500); // Wait for fade-out to complete
    };

    return (
        <div className={`welcome-container ${fadeIn ? 'fade-in' : ''} ${fadeOut ? 'fade-out' : ''}`}>
            <div className="welcome-content">
                <div className="quote-section">
                    <p className="quote">"Dove la mente trova la pace,</p>
                    <p className="quote">un passo alla volta."</p>
                </div>
                <button className="welcome-btn" onClick={handleAccediClick}>
                    Accedi
                </button>
            </div>
        </div>
    );
};

export default Welcome;
