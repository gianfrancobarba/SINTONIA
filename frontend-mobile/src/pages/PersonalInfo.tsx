import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftArrow from '../assets/icons/LeftArrow.svg';
import { User, Cake, MapPin, Mail, AlertCircle } from 'lucide-react';
import { getPersonalInfo, updatePersonalInfo } from '../services/settings.service.ts';
import type { PersonalInfoDto } from '../types/settings.ts';
import Toast from '../components/Toast';
import '../css/PersonalInfo.css';

const PersonalInfo: React.FC = () => {
    const navigate = useNavigate();
    const [personalData, setPersonalData] = useState<PersonalInfoDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmail, setEditedEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

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
    };

    const hideToast = () => {
        setToast({ ...toast, show: false });
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEmailError(null);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedEmail(personalData?.email || '');
        setEmailError(null);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEditedEmail(newEmail);

        // Validate email on change
        if (newEmail && !validateEmail(newEmail)) {
            setEmailError('Inserisci un indirizzo email valido');
        } else {
            setEmailError(null);
        }
    };

    const handleSave = async () => {
        if (!editedEmail) {
            setEmailError('L\'email è obbligatoria');
            return;
        }

        if (!validateEmail(editedEmail)) {
            setEmailError('Inserisci un indirizzo email valido');
            return;
        }

        try {
            setIsSaving(true);
            await updatePersonalInfo({ email: editedEmail });

            // Update local state
            if (personalData) {
                setPersonalData({ ...personalData, email: editedEmail });
            }

            setIsEditing(false);
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
                    {!isEditing ? (
                        <button className="edit-button" onClick={handleEditClick} aria-label="Modifica">
                            Modifica
                        </button>
                    ) : (
                        <button className="cancel-button" onClick={handleCancelEdit} aria-label="Annulla">
                            Annulla
                        </button>
                    )}
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
                    <div className={`title-input-container ${isEditing ? 'editable' : 'disabled'} ${hasChanges && isEditing ? 'modified' : ''}`}>
                        <Mail size={20} color={hasChanges && isEditing ? "#4a9d6f" : "#9CA3AF"} style={{ marginRight: '10px' }} />
                        <input
                            type="email"
                            className="title-input"
                            value={editedEmail}
                            onChange={handleEmailChange}
                            placeholder="Inserisci la tua email"
                            readOnly={!isEditing}
                            maxLength={100}
                        />
                    </div>
                    {emailError && (
                        <div className="error-message">
                            <AlertCircle size={16} />
                            <span>{emailError}</span>
                        </div>
                    )}
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
                    <label className="form-label">Residenza</label>
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

                {isEditing && (
                    <button
                        className={`submit-button ${hasChanges && !emailError ? 'active' : 'disabled'}`}
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving || !!emailError}
                    >
                        {isSaving ? 'Salvataggio...' : 'Salva Modifiche'}
                    </button>
                )}
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={2000}
                    onClose={hideToast}
                />
            )}
        </div>
    );
};

export default PersonalInfo;
