import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftArrow from '../assets/icons/LeftArrow.svg';
import { User, Cake, MapPin, Mail } from 'lucide-react';
import { getPersonalInfo } from '../services/settings.service.ts';
import type { PersonalInfoDto } from '../types/settings.ts';
import '../css/PersonalInfo.css';

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
                    <div className="title-input-container">
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
                    <div className="title-input-container">
                        <Mail size={20} color="#9CA3AF" style={{ marginRight: '10px' }} />
                        <input
                            type="text"
                            className="title-input"
                            value={personalData.email}
                            readOnly
                        />
                    </div>
                </div>

                <div className="form-section">
                    <label className="form-label">Data di Nascita</label>
                    <div className="title-input-container">
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
                    <div className="title-input-container">
                        <MapPin size={20} color="#9CA3AF" style={{ marginRight: '10px' }} />
                        <input
                            type="text"
                            className="title-input"
                            value={personalData.indirizzo || 'Non specificato'}
                            readOnly
                        />
                    </div>
                </div>

                <button className="submit-button" onClick={handleBack}>
                    Torna alle Impostazioni
                </button>
            </div>
        </div>
    );
};

export default PersonalInfo;
