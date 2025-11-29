import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPersonalInfo } from '../../services/settings.service';
import type { PersonalInfoDto } from '../../types/settings';
import BottomNavigation from '../../components/BottomNavigation';
import LeftArrowIcon from '../../assets/icons/LeftArrow.svg';
import '../../css/settings/PersonalInfo.css';

const PersonalInfo: React.FC = () => {
    const navigate = useNavigate();
    const [personalData, setPersonalData] = useState<PersonalInfoDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPersonalInfo();
                setPersonalData(data);
            } catch (err) {
                setError('Errore nel caricamento dei dati');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleBack = () => {
        navigate('/settings');
    };

    if (loading) {
        return (
            <div className="personal-info-page">
                <div className="personal-info-loading">Caricamento...</div>
            </div>
        );
    }

    if (error || !personalData) {
        return (
            <div className="personal-info-page">
                <div className="personal-info-error">{error || 'Dati non disponibili'}</div>
            </div>
        );
    }

    // Formatta il sesso in modo leggibile
    const formatSesso = (sesso: string) => {
        switch (sesso) {
            case 'M': return 'Maschile';
            case 'F': return 'Femminile';
            default: return sesso;
        }
    };

    return (
        <div className="personal-info-page">
            {/* Header */}
            <div className="personal-info-header">
                <button className="personal-info-back-btn" onClick={handleBack} aria-label="Indietro">
                    <img src={LeftArrowIcon} alt="Back" />
                </button>
                <h1 className="personal-info-title">Informazioni Personali</h1>
            </div>

            {/* Curved Background */}
            <div className="personal-info-background"></div>

            {/* Content */}
            <div className="personal-info-content">
                <div className="info-card">
                    <div className="info-item">
                        <label className="info-label">Nome</label>
                        <div className="info-value">{personalData.nome}</div>
                    </div>

                    <div className="info-item">
                        <label className="info-label">Cognome</label>
                        <div className="info-value">{personalData.cognome}</div>
                    </div>

                    <div className="info-item">
                        <label className="info-label">Email</label>
                        <div className="info-value">{personalData.email}</div>
                    </div>

                    <div className="info-item">
                        <label className="info-label">Codice Fiscale</label>
                        <div className="info-value">{personalData.codFiscale}</div>
                    </div>

                    <div className="info-item">
                        <label className="info-label">Data di Nascita</label>
                        <div className="info-value">{personalData.dataNascita}</div>
                    </div>

                    <div className="info-item">
                        <label className="info-label">Residenza</label>
                        <div className="info-value">{personalData.residenza}</div>
                    </div>

                    <div className="info-item">
                        <label className="info-label">Sesso</label>
                        <div className="info-value">{formatSesso(personalData.sesso)}</div>
                    </div>
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
};

export default PersonalInfo;
