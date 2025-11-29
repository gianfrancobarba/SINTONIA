import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Cake, MapPin, Mail } from 'lucide-react';
import { getPersonalInfo } from '../../services/settings.service';
import type { PersonalInfoDto } from '../../types/settings';
import '../../css/settings/PersonalInfo.css';

const PersonalInfo: React.FC = () => {
    const navigate = useNavigate();
    const [personalData, setPersonalData] = useState<PersonalInfoDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const data = await getPersonalInfo();
                setPersonalData(data);
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

    const handleSave = () => {
        // Per ora il bottone "Salva" non fa nulla perché i dati sono read-only
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
            {/* Header */}
            <div className="info-header">
                <button className="back-button" onClick={handleBack} aria-label="Indietro">
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <h1 className="page-title">Informazioni Personali</h1>
            </div>

            {/* Form Fields */}
            <div className="info-form">
                <div className="form-field">
                    <label className="field-label">Nome</label>
                    <div className="field-input">
                        <User size={20} className="field-icon" />
                        <span className="field-value">{personalData.nome}</span>
                    </div>
                </div>

                <div className="form-field">
                    <label className="field-label">Cognome</label>
                    <div className="field-input">
                        <User size={20} className="field-icon" />
                        <span className="field-value">{personalData.cognome}</span>
                    </div>
                </div>

                <div className="form-field">
                    <label className="field-label">Data di nascita</label>
                    <div className="field-input">
                        <Cake size={20} className="field-icon" />
                        <span className="field-value">{formatDate(personalData.dataNascita)}</span>
                    </div>
                </div>

                <div className="form-field">
                    <label className="field-label">Comune di residenza</label>
                    <div className="field-input">
                        <MapPin size={20} className="field-icon" />
                        <span className="field-value">{personalData.residenza}</span>
                    </div>
                </div>

                <div className="form-field">
                    <label className="field-label">Email</label>
                    <div className="field-input">
                        <Mail size={20} className="field-icon" />
                        <span className="field-value">{personalData.email}</span>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <button className="save-button" onClick={handleSave}>
                Salva
            </button>
        </div>
    );
};

export default PersonalInfo;
