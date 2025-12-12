import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Splash.css';

const Splash = () => {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade out after 1.5 seconds
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 1500);

        // Navigate to welcome after fade out completes
        const navTimer = setTimeout(() => {
            navigate('/welcome');
        }, 2000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(navTimer);
        };
    }, [navigate]);

    return (
        <div className={`splash-container ${fadeOut ? 'fade-out' : ''}`}>
            <div className="logo">
                <img src="/sintonia-logo-new.jpg" alt="Sintonia" className="splash-logo-img" />
            </div>
        </div>
    );
};

export default Splash;
