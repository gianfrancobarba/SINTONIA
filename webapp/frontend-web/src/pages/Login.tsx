
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getUserRole } from '../services/auth.service';
import { Eye, EyeOff, Edit2, UserRound } from 'lucide-react';
import '../css/Login.css'; // We'll create this CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'admin' | 'psychologist'>('admin');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            const role = getUserRole();
            if (role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Credenziali non valide. Riprova.');
        }
    };

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
        // Redirect directly to provider login
        window.location.href = `http://localhost:3000/spid-auth/provider-login?provider=${providerName}&frontendUrl=http://localhost:5174&userType=psychologist`;
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-container">
                    <img src="/sintonia-logo-new.jpg" alt="Sintonia" className="logo-image" />
                </div>

                <div className="login-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        Amministratore
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'psychologist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('psychologist')}
                    >
                        Psicologo
                    </button>
                </div>

                {activeTab === 'admin' ? (
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Email</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Inserisci la tua email"
                                />
                                <Edit2 size={18} className="input-icon" />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={!showPassword ? "password-hidden" : ""}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Inserisci la password"
                                />
                                <button type="button" className="icon-button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="login-button">ACCEDI</button>
                    </form>
                ) : (
                    <div className="spid-login-section">
                        <p className="spid-info-text">
                            <strong>Benvenuto in Sintonia.</strong><br />
                            Utilizza la tua identità digitale SPID per accedere in modo sicuro alla tua area riservata e gestire il percorso terapeutico dei tuoi pazienti.
                        </p>

                        <div className="spid-dropdown-container">
                            <button
                                onClick={() => setShowSpidProviders(!showSpidProviders)}
                                className={`spid-button ${showSpidProviders ? 'active' : ''}`}
                            >
                                <span className="spid-icon"><UserRound size={20} /></span>
                                ENTRA CON SPID
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

                        <div className="spid-logo-footer">
                            <img src="/spid-agid-footer.png" alt="SPID" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
