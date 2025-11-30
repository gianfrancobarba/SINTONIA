import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { submitSupportRequest } from '../../services/settings.service';
import '../../css/settings/TechnicalSupport.css';

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

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitolo(e.target.value);
        if (error) setError(null);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescrizione(e.target.value);
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validazione client-side
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
                // Redirect dopo 2 secondi
                setTimeout(() => {
                    navigate('/settings');
                }, 2000);
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
            {/* Header */}
            <div className="technical-support-header">
                <button className="technical-support-back-btn" onClick={handleBack} aria-label="Indietro">
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <h1 className="technical-support-title">Supporto Tecnico</h1>
            </div>

            {/* Content */}
            <div className="technical-support-content">
                {success ? (
                    <div className="success-message">
                        <div className="success-icon">✓</div>
                        <h2>Richiesta Inviata!</h2>
                        <p>La tua richiesta di supporto è stata inviata con successo. Verrai ricontattato al più presto.</p>
                    </div>
                ) : (
                    <form className="support-form" onSubmit={handleSubmit}>
                        <div className="form-header">
                            <h2 className="form-title">Ticket</h2>
                            <p className="form-subtitle">
                                Descrivi la tua problematica, un amministratore di sistema saprà aiutarti!
                            </p>
                        </div>

                        <input
                            type="text"
                            value={titolo}
                            onChange={handleTitleChange}
                            className="form-input-title"
                            placeholder="Titolo della richiesta"
                            disabled={loading}
                        />

                        <textarea
                            value={descrizione}
                            onChange={handleDescriptionChange}
                            className="form-textarea-main"
                            placeholder="Non riesco ad aprire più il mio diario. Mi dice &quot;errore generico&quot;."
                            rows={8}
                            disabled={loading}
                        />

                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="submit-button-main"
                            disabled={loading}
                        >
                            {loading ? 'Invio in corso...' : (
                                <>
                                    Invia richiesta
                                    <ArrowRight size={20} strokeWidth={2.5} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default TechnicalSupport;
