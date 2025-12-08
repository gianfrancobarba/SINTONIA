import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftArrow from '../assets/icons/LeftArrow.svg';
import { submitSupportRequest } from '../services/settings.service.ts';
import '../css/TechnicalSupport.css';

const TechnicalSupport: React.FC = () => {
    const navigate = useNavigate();
    const [titolo, setTitolo] = useState('');
    const [descrizione, setDescrizione] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBack = () => {
        navigate('/settings');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!titolo.trim()) {
            setError('Il titolo è obbligatorio');
            return;
        }
        if (!descrizione.trim()) {
            setError('La descrizione è obbligatoria');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await submitSupportRequest({
                oggetto: titolo.trim(),
                descrizione: descrizione.trim(),
            });
            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/settings');
                }, 2000);
            } else {
                setError('Errore durante l\'invio: ' + (response.message || 'Riprova più tardi.'));
            }
        } catch (err) {
            setError('Errore durante l\'invio della richiesta. Riprova.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="technical-support-page">
            <div className="technical-support-header">
                <div className="header-content">
                    <button className="back-button" onClick={handleBack} aria-label="Indietro">
                        <img src={LeftArrow} alt="" />
                    </button>
                    <h1 className="header-title">Supporto Tecnico</h1>
                </div>
            </div>

            <div className="technical-support-content">
                {success ? (
                    <div className="success-message">
                        <div className="success-icon">✓</div>
                        <h2>Richiesta Inviata!</h2>
                        <p>Il nostro team ti risponderà al più presto.</p>
                    </div>
                ) : (
                    <form className="support-form" onSubmit={handleSubmit}>
                        <div className="form-header">
                            <p className="form-subtitle">
                                Hai riscontrato un problema? Descrivilo qui sotto e ti aiuteremo a risolverlo.
                            </p>
                        </div>

                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <div className="form-section">
                            <label className="form-label">Oggetto</label>
                            <div className="title-input-container">
                                <input
                                    type="text"
                                    className="title-input"
                                    placeholder="Es. Problema con il diario"
                                    value={titolo}
                                    onChange={(e) => setTitolo(e.target.value)}
                                    disabled={loading}
                                    maxLength={60}
                                    spellCheck={false}
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <label className="form-label">Descrizione</label>
                            <div className="textarea-container">
                                <textarea
                                    className="content-textarea"
                                    placeholder="Descrivi il problema in dettaglio..."
                                    value={descrizione}
                                    onChange={(e) => setDescrizione(e.target.value)}
                                    disabled={loading}
                                    maxLength={500}
                                />
                                <div className="char-counter">
                                    {descrizione.length}/500
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Invio in corso...' : 'Invia Richiesta'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default TechnicalSupport;
