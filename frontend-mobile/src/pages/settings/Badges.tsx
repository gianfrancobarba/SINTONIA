import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import '../../css/settings/Badges.css';

interface Badge {
    nome: string;
    descrizione: string;
    immagineBadge?: string;
    dataAcquisizione: Date;
}

interface BadgeData {
    numeroBadge: number;
    badges: Badge[];
}

const Badges: React.FC = () => {
    const navigate = useNavigate();
    const [badgeData, setBadgeData] = useState<BadgeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        navigate('/settings');
    };

    if (loading) {
        return (
            <div className="badges-page">
                <div className="badges-loading">Caricamento...</div>
            </div>
        );
    }

    if (error || !badgeData) {
        return (
            <div className="badges-page">
                <div className="badges-error">{error || 'Dati non disponibili'}</div>
            </div>
        );
    }

    // Creare array di 28 badge (7x4 griglia) con colori assegnati
    const totalBadgeSlots = 28;
    const badgeColors = [
        '#FFFFFF', '#FF6B4A', '#B8A391', '#B8A391', '#CDB4A8', '#A89080', '#8FAF69',
        '#CDB4A8', '#1E4A5F', '#8FAF69', '#8FAF69', '#FF6B4A', '#E8B84D', '#FFFFFF',
        '#FFFFFF', '#FFFFFF', '#FFFFFF', '#8FAF69', '#1E4A5F', '#1E4A5F', '#CDB4A8',
        '#CDB4A8', '#A89080', '#FF6B4A', '#E8B84D', '#FFFFFF', '#FFFFFF', '#FFFFFF',
    ];

    const renderBadgeGrid = () => {
        const badgeSlots = [];
        for (let i = 0; i < totalBadgeSlots; i++) {
            const isEarned = i < badgeData.numeroBadge;
            const backgroundColor = isEarned ? badgeColors[i] : '#FFFFFF';
            const borderColor = backgroundColor === '#FFFFFF' ? '#E5E7EB' : backgroundColor;

            badgeSlots.push(
                <div
                    key={i}
                    className="badge-circle"
                    style={{
                        backgroundColor,
                        border: `2px solid ${borderColor}`,
                    }}
                />
            );
        }
        return badgeSlots;
    };

    return (
        <div className="badges-page">
            {/* Header Section */}
            <div className="badges-header">
                {/* Organic shapes in background */}
                <div className="organic-shape organic-shape-1"></div>
                <div className="organic-shape organic-shape-2"></div>
                <div className="organic-shape organic-shape-3"></div>
                <div className="organic-shape organic-shape-4"></div>
                <div className="organic-shape organic-shape-5"></div>

                <button className="badges-back-btn" onClick={handleBack} aria-label="Indietro">
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </button>

                <h1 className="badges-title">I Tuoi Badge</h1>

                <div className="badges-count">
                    <div className="badges-number">{badgeData.numeroBadge}</div>
                    <p className="badges-subtitle">Badge ottenuti fino ad ora.</p>
                </div>
            </div>

            {/* Badge History Section */}
            <div className="badges-content">
                <div className="badges-wave"></div>

                <div className="badges-history">
                    <h2 className="badges-history-title">Storico Badge</h2>
                    <div className="badges-grid">
                        {renderBadgeGrid()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Badges;
