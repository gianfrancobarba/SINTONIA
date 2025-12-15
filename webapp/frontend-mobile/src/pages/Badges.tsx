import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftArrow from '../assets/icons/LeftArrow.svg';
import '../css/Badges.css';
import LoadingSpinner from '../components/LoadingSpinner';
import { BadgeIcon } from '../components/BadgeIcons';

interface Badge {
    nome: string;
    descrizione: string;
    immagineBadge?: string;
    dataAcquisizione?: string;
}

interface BadgeData {
    numeroBadge: number;
    badges: Badge[];
}

// Badge to category mapping
type CategoryType = 'questionari' | 'diario' | 'umore' | 'forum';

const BADGE_CATEGORIES: Record<string, CategoryType> = {
    'Primo Questionario': 'questionari',
    'Cinque Questionari': 'questionari',
    'Dieci Questionari': 'questionari',
    'Venticinque Questionari': 'questionari',
    'Screening Completo': 'questionari',
    'Prima Nota Diario': 'diario',
    'Diario Costante': 'diario',
    'Narratore': 'diario',
    'Diario Esperto': 'diario',
    'Primo Stato dAnimo': 'umore',
    'Monitoraggio Umore': 'umore',
    'Streak Week': 'umore',
    'Streak Master': 'umore',
    'Prima Domanda Forum': 'forum',
    'Voce Attiva': 'forum',
    'Prima Risposta Ricevuta': 'forum',
};

const FILTER_OPTIONS: { key: 'all' | CategoryType; label: string }[] = [
    { key: 'all', label: 'Tutti' },
    { key: 'questionari', label: 'Questionari' },
    { key: 'diario', label: 'Diario' },
    { key: 'umore', label: 'Umore' },
    { key: 'forum', label: 'Forum' },
];

const Badges: React.FC = () => {
    const navigate = useNavigate();
    const [badgeData, setBadgeData] = useState<BadgeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<'all' | CategoryType>('all');

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const token = localStorage.getItem('patient_token');
                if (!token) {
                    navigate('/spid-info');
                    return;
                }

                const response = await fetch('http://localhost:3000/paziente/badge/lista', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('patient_token');
                    navigate('/spid-info');
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setBadgeData(data);
            } catch (err) {
                setError('Errore nel caricamento dei badge');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBadges();
    }, [navigate]);

    const handleBack = () => {
        navigate('/profile');
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !badgeData) {
        return (
            <div className="badges-page">
                <div className="error">{error || 'Dati non disponibili'}</div>
            </div>
        );
    }

    // Filter badges based on selected category
    const filteredBadges = selectedFilter === 'all'
        ? badgeData.badges
        : badgeData.badges.filter(b => BADGE_CATEGORIES[b.nome] === selectedFilter);

    return (
        <div className="badges-page">
            <div className="badges-header">
                <div className="header-content">
                    <button className="back-button" onClick={handleBack} aria-label="Indietro">
                        <img src={LeftArrow} alt="" />
                    </button>
                    <h1 className="header-title">I Tuoi Badge</h1>
                </div>
            </div>

            <div className="badges-summary">
                <div className="badges-count">{badgeData.numeroBadge} / {badgeData.badges.length}</div>
                <p className="badges-subtitle">Badge collezionati</p>
            </div>

            {/* Filter Buttons */}
            <div className="filter-buttons">
                {FILTER_OPTIONS.map(opt => (
                    <button
                        key={opt.key}
                        className={`filter-btn ${selectedFilter === opt.key ? 'active' : ''}`}
                        onClick={() => setSelectedFilter(opt.key)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className="badges-container">
                <div className="badges-grid">
                    {filteredBadges.map((badge, index) => {
                        const isUnlocked = !!badge.dataAcquisizione;

                        return (
                            <div
                                key={index}
                                className={`badge-item ${isUnlocked ? 'unlocked' : 'locked'}`}
                            >
                                <div className="badge-icon-wrapper">
                                    <BadgeIcon name={badge.nome} size={48} />
                                </div>
                                <h3 className="badge-name">{badge.nome}</h3>
                                <p className="badge-desc">{badge.descrizione}</p>

                                {isUnlocked ? (
                                    <div className="badge-date">
                                        {new Date(badge.dataAcquisizione!).toLocaleDateString('it-IT', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </div>
                                ) : (
                                    <div className="badge-locked-label">BLOCCATO</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Badges;
