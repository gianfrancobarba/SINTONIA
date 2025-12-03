import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Toast from '../components/Toast';
import '../css/PsychologistTechnicalSupport.css';
import { submitSupportRequest } from '../services/psychologist.service';

const PsychologistTechnicalSupport: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !description.trim()) return;

        setIsSubmitting(true);

        try {
            await submitSupportRequest({
                oggetto: subject,
                descrizione: description,
            });

            setSubject('');
            setDescription('');
            setToast({
                message: 'Richiesta di supporto inviata con successo!',
                type: 'success'
            });
        } catch (error) {
            console.error(error);
            setToast({
                message: 'Errore durante l\'invio della richiesta. Riprova.',
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };



    return (

        <div className="content-panel">
            <div className="psychologist-support-container">
                <div className="support-layout">
                    {/* Left Side: Header & Info */}
                    <div className="support-header-side">
                        <div className="header-content">
                            <h1 className="support-title">
                                Supporto Tecnico
                            </h1>
                            <p className="support-subtitle">
                                Hai riscontrato un problema?
                                <br /><br />
                                Ti invitiamo a compilare il modulo per inoltrare una richiesta al supporto tecnico. Riceverai una risposta nel più breve tempo possibile.
                            </p>
                        </div>

                        <div className="support-illustration">
                            <div className="illustration-circle">
                                <Send size={40} color="white" />
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="support-form-side">
                        <div className="support-form-card">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Oggetto della richiesta</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Es. Errore nel caricamento pazienti..."
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Descrizione dettagliata</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Descrivi il problema riscontrato, includendo eventuali messaggi di errore..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                        disabled={isSubmitting || !subject || !description}
                                    >
                                        <Send size={18} />
                                        {isSubmitting ? 'Invio in corso...' : 'Invia Richiesta'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};


export default PsychologistTechnicalSupport;
