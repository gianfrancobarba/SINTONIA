import { useState, useEffect } from 'react';
import '../css/SPIDInfo.css';

const SPIDInfo = () => {
    const [fadeIn, setFadeIn] = useState(false);
    const [showSpidProviders, setShowSpidProviders] = useState(false);

    const spidProviders = [
        { name: 'Poste Italiane', logo: 'https://raw.githubusercontent.com/italia/spid-graphics/master/idp-logos/spid-idp-posteid.svg' },
        { name: 'Aruba', logo: 'https://raw.githubusercontent.com/italia/spid-graphics/master/idp-logos/spid-idp-arubaid.svg' },
        { name: 'InfoCert', logo: 'https://raw.githubusercontent.com/italia/spid-graphics/master/idp-logos/spid-idp-infocertid.svg' },
        { name: 'Intesa', logo: 'https://raw.githubusercontent.com/italia/spid-graphics/master/idp-logos/spid-idp-intesaid.svg' },
        { name: 'Namirial', logo: 'https://raw.githubusercontent.com/italia/spid-graphics/master/idp-logos/spid-idp-namirialid.svg' },
        { name: 'Sielte', logo: 'https://raw.githubusercontent.com/italia/spid-graphics/master/idp-logos/spid-idp-sielteid.svg' },
        { name: 'Register.it', logo: 'https://raw.githubusercontent.com/italia/spid-graphics/master/idp-logos/spid-idp-spiditalia.svg' },
        { name: 'Tim', logo: 'https://raw.githubusercontent.com/italia/spid-graphics/master/idp-logos/spid-idp-timid.svg' },
        { name: 'Lepida', logo: 'https://raw.githubusercontent.com/italia/spid-graphics/master/idp-logos/spid-idp-lepidaid.svg' },
    ];

    const handleSpidLogin = (providerName: string) => {
        // Redirect directly to provider login for mobile (patient)
        window.location.href = `http://localhost:3000/spid-auth/provider-login?provider=${providerName}&frontendUrl=http://localhost:5173&userType=patient`;
    };

    useEffect(() => {
        // Trigger fade in animation
        setTimeout(() => setFadeIn(true), 50);
    }, []);

    return (
        <div className={`spid-info-container ${fadeIn ? 'fade-in' : ''}`}>
            <div className="spid-info-card">
                <img src="/sintonia-logo-new.jpg" alt="Sintonia" style={{ width: '150px' }} />
                <h1 className="spid-title">
                    Accedi all'area riservata
                </h1>

                <p className="spid-description">
                    SPID, il Sistema Pubblico di Identità Digitale, è il sistema di accesso che consente di utilizzare, con un'identità digitale unica, i servizi online della Pubblica Amministrazione e dei privati accreditati. Se sei già in possesso di un'identità digitale, accedi con le credenziali del tuo gestore. Se non hai ancora un'identità digitale, richiedila ad uno dei gestori.
                </p>

                <div className="spid-links">
                    <a href="https://www.spid.gov.it" target="_blank" rel="noopener noreferrer">
                        Maggiori informazioni su SPID
                    </a>
                    <a href="https://www.spid.gov.it/richiedi-spid" target="_blank" rel="noopener noreferrer">
                        Non hai SPID?
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Servizio aiuto'); }}>
                        Serve aiuto?
                    </a>
                </div>

                <div className="spid-dropdown-container">
                    <button
                        className={`spid-login-btn ${showSpidProviders ? 'active' : ''}`}
                        onClick={() => setShowSpidProviders(!showSpidProviders)}
                    >
                        Entra con SPID
                        <span className={`arrow-icon ${showSpidProviders ? 'rotated' : ''}`}>▼</span>
                    </button>

                    {showSpidProviders && (
                        <div className="spid-providers-list">
                            {spidProviders.map((provider) => (
                                <button
                                    key={provider.name}
                                    className="provider-item"
                                    onClick={() => handleSpidLogin(provider.name)}
                                >
                                    <img
                                        src={provider.logo}
                                        alt={`${provider.name} ID`}
                                        className="provider-logo-img"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="spid-logos">
                    <img src="/spid-agid-footer.png" alt="SPID AgID" style={{ height: '30px', width: 'auto', opacity: 1 }} />
                </div>
            </div>
        </div>
    );
};

export default SPIDInfo;
