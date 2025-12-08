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
                                        maxLength={100}
                                        required
                                    />
                                    <div style={{
                                        textAlign: 'right',
                                        fontSize: '12px',
                                        color: subject.length >= 100 ? '#E57373' : '#999',
                                        marginTop: '4px'
                                    }}>
                                        {subject.length}/100 caratteri
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Descrizione dettagliata</label>
                                    <div style={{
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        backgroundColor: '#fafafa',
                                        transition: 'all 0.2s ease'
                                    }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--color-teal-medium)';
                                            e.currentTarget.style.backgroundColor = 'white';
                                            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(43, 122, 122, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = '#e0e0e0';
                                            e.currentTarget.style.backgroundColor = '#fafafa';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <textarea
                                            placeholder="Descrivi il problema riscontrato, includendo eventuali messaggi di errore..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            maxLength={2000}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '16px 20px',
                                                border: 'none',
                                                fontSize: '15px',
                                                fontFamily: 'inherit',
                                                resize: 'none',
                                                minHeight: '200px',
                                                maxHeight: '260px',
                                                overflowY: 'auto',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                backgroundColor: 'transparent'
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        textAlign: 'right',
                                        fontSize: '12px',
                                        color: description.length >= 2000 ? '#E57373' : '#999',
                                        marginTop: '4px'
                                    }}>
                                        {description.length}/2000 caratteri
                                    </div>
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
