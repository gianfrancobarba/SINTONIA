import React, { useState, useEffect } from 'react';
import '../css/PWAInstallLanding.css';

const PWAInstallLanding: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));

        // Capture install prompt event (Android/Desktop)
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowIOSInstructions(true);
        } else if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            setDeferredPrompt(null);
        } else {
            // Fallback if prompt is not available (e.g. already installed or unsupported browser)
            alert('Per installare l\'app, usa il menu del browser e seleziona "Aggiungi a schermata Home" o "Installa App".');
        }
    };

    return (
        <div className="pwa-landing-container">
            <div className="pwa-content">
                <div className="pwa-logo-container">
                    <img src="/sintonia-logo-new.jpg" alt="Sintonia Logo" className="pwa-logo" />
                </div>

                <div className="pwa-intro-text">
                    <p className="quote">"Dove la mente trova la pace,</p>
                    <p className="quote">un passo alla volta."</p>
                </div>

                <div className="pwa-actions">
                    <button className="install-btn" onClick={handleInstallClick}>
                        Installa App
                    </button>
                    <p className="pwa-note">
                        Installa l'applicazione per un'esperienza completa e senza distrazioni.
                    </p>
                </div>
            </div>

            <footer className="pwa-footer">
                © 2025 SINTONIA · Gruppo C09
            </footer>

            {/* iOS Instructions Overlay */}
            {showIOSInstructions && (
                <div className="ios-instructions-overlay" onClick={() => setShowIOSInstructions(false)}>
                    <div className="ios-instructions-card" onClick={e => e.stopPropagation()}>
                        <div className="ios-header">
                            <h3>Installa su iPhone</h3>
                            <button className="close-btn" onClick={() => setShowIOSInstructions(false)}>✕</button>
                        </div>
                        <div className="ios-steps">
                            <div className="step">
                                <div className="step">
                                    1. Premi il tasto <strong>Menu</strong>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ios-icon" style={{ display: 'inline-block', verticalAlign: 'text-bottom', margin: '0 4px', color: '#007AFF' }}>
                                        <circle cx="5" cy="12" r="2" fill="currentColor" />
                                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                                        <circle cx="19" cy="12" r="2" fill="currentColor" />
                                    </svg>
                                    in basso a destra
                                </div>
                            </div>
                            <div className="step">
                                2. Scorri e seleziona <strong>"Condividi"</strong>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ios-icon" style={{ display: 'inline-block', verticalAlign: 'text-bottom', margin: '0 4px', color: '#007AFF' }}>
                                    <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="step">
                                3. Seleziona <strong>"Aggiungi alla schermata Home"</strong>
                            </div>
                            <div className="step">
                                4. Premi <strong>Aggiungi</strong> in alto a destra
                            </div>
                        </div>
                        <div className="ios-arrow-hint">
                             Premi qui sotto 👇
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PWAInstallLanding;
