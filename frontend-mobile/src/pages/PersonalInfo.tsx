import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftArrow from '../assets/icons/LeftArrow.svg';
import { User, Cake, MapPin, Mail, Save } from 'lucide-react';
import { getPersonalInfo, updatePersonalInfo } from '../services/settings.service.ts';
import type { PersonalInfoDto } from '../types/settings.ts';
import '../css/PersonalInfo.css';

const PersonalInfo: React.FC = () => {
    const navigate = useNavigate();
    const [personalData, setPersonalData] = useState<PersonalInfoDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [editedEmail, setEditedEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Toast state
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const data = await getPersonalInfo();
                setPersonalData(data);
                setEditedEmail(data.email);
            } catch (err) {
                setError('Errore nel caricamento delle informazioni');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonalInfo();
    }, []);

    const handleBack = () => {
        navigate('/settings');
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
    };

    const handleSave = async () => {
        if (!editedEmail || !editedEmail.includes('@')) {
            showToast('Inserisci un indirizzo email valido', 'error');
            return;
        }

        try {
            setIsSaving(true);
            await updatePersonalInfo({ email: editedEmail });

            // Update local state
            if (personalData) {
                setPersonalData({ ...personalData, email: editedEmail });
            }

            showToast('Modifiche salvate con successo', 'success');
        } catch (err) {
            console.error(err);
            showToast('Errore durante il salvataggio', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Check if changes have been made
    const hasChanges = personalData ? editedEmail !== personalData.email : false;

    if (loading) {
        return (
            <div className="personal-info-page">
                <div className="loading">Caricamento...</div>
            </div>
        );
    }

    if (error || !personalData) {
        return (
            <div className="personal-info-page">
                <div className="error">{error || 'Dati non disponibili'}</div>
            </div>
        );
    }

    return (
        <div className="personal-info-page">
            <div className="personal-info-header">
                <div className="header-content">
                    <button className="back-button" onClick={handleBack} aria-label="Indietro">
                        <img src={LeftArrow} alt="" />
                    </button>
                    <h1 className="header-title">Informazioni Personali</h1>
                </div>
            </div>

            <div className="personal-info-content">
                <div className="form-section">
                    <label className="form-label">Nome e Cognome</label>
                    <div className="title-input-container disabled">
                        <User size={20} color="#9CA3AF" style={{ marginRight: '10px' }} />
                        <input
                            type="text"
                            className="title-input"
                            value={`${personalData.nome} ${personalData.cognome}`}
                            readOnly
                        />
                    </div>
                </div>

                <div className="form-section">
                    <label className="form-label">Email</label>
                    <div className={`title-input-container editable ${hasChanges ? 'modified' : ''}`}>
                        <Mail size={20} color={hasChanges ? "#4a9d6f" : "#9CA3AF"} style={{ marginRight: '10px' }} />
                        <input
                            type="email"
                            className="title-input"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            placeholder="Inserisci la tua email"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <label className="form-label">Data di Nascita</label>
                    <div className="title-input-container disabled">
                        <Cake size={20} color="#9CA3AF" style={{ marginRight: '10px' }} />
                        <input
                            type="text"
                            className="title-input"
                            value={formatDate(personalData.dataNascita)}
                            readOnly
                        />
                    </div>
                </div>

                <div className="form-section">
                    <label className="form-label">Indirizzo</label>
                    <div className="title-input-container disabled">
                        <MapPin size={20} color="#9CA3AF" style={{ marginRight: '10px' }} />
                        <input
                            type="text"
                            className="title-input"
                            value={personalData.residenza || 'Non specificato'}
                            readOnly
                        />
                    </div>
                </div>

                <button
                    className={`submit-button ${hasChanges ? 'active' : 'disabled'}`}
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                >
                    {isSaving ? 'Salvataggio...' : 'Salva Modifiche'}
                </button>
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <div className={`toast-notification ${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default PersonalInfo;
