import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Award, Smile, Clock } from 'lucide-react';
import { getProfileData } from '../services/profile.service';
import type { ProfileDto } from '../types/profile';
import '../css/Profile.css';
import profileAvatarWoman from '../assets/images/profile-avatar-woman.png';
import profileAvatarMan from '../assets/images/profile-avatar-man.png';
import diaryIcon from '../assets/icons/diary.svg';
import questionnaireIcon from '../assets/icons/questionnaire.svg';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCache } from '../contexts/CacheContext';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { profileData, setProfileData } = useCache();
    const [loading, setLoading] = useState(!profileData);
    const [error, setError] = useState<string | null>(null);

    // Fetch profile data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!profileData) setLoading(true);
                const data = await getProfileData();
                setProfileData(data);
            } catch (err) {
                setError('Errore nel caricamento dei dati');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);



    // Loading state
    if (loading) {
        return (
            <div className="loading-screen">
                <LoadingSpinner />
            </div>
        );
    }

    // Error state
    if (error || !profileData) {
        return (
            <div className="profile-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>Errore: {error || 'Dati non disponibili'}</div>
            </div>
        );
    }

    // Map backend data to UI format
    const { profilo, badge, statoAnimo, diario, questionari } = profileData;

    // Select avatar based on gender
    const profileAvatar = profilo.sesso === 'F' ? profileAvatarWoman : profileAvatarMan;

    const name = profilo.nome;
    const badges = {
        total: badge.numeroBadge,
        progress: Math.min(badge.numeroBadge / 16, 1)  // Progress calcolato (16 badge totali)
    };

    // Mood data with placeholder if null
    const hasMoodData = statoAnimo !== null && statoAnimo.storicoRecente.length > 0;
    const mood = {
        current: statoAnimo?.umore || 'Nessun dato',
        weekData: hasMoodData
            ? statoAnimo.storicoRecente.map(entry => entry.intensita || 5)
            : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  // Placeholder vuoto
    };

    // Diary data
    const diaryData = diario ? {
        date: diario.ultimaEntryData,
        lastEntry: diario.ultimaEntryAnteprima
    } : null;

    // Questionnaires data
    const questionnairesData = {
        daysAgo: 10,  // TODO: Calcolare dalla data ultimo questionario
        message: questionari.messaggioPromemoria || `Hai ${questionari.numeroDaCompilare} questionari da completare`
    };

    // Calculate circle progress for badges
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (badges.progress * circumference);

    // Normalize mood data for chart (0-10 scale)
    const maxHeight = Math.max(...mood.weekData, 1);  // Evita divisione per 0
    const normalizedData = mood.weekData.map(val => (val / maxHeight) * 100);

    return (
        <div className="profile-page">
            {/* Organic Background Header */}
            <div className="organic-background">
                <div className="organic-shape shape-1"></div>
                <div className="organic-shape shape-2"></div>
                <div className="organic-shape shape-3"></div>
                <div className="organic-shape shape-4"></div>
            </div>

            {/* Settings Icon */}
            <button
                className="settings-button"
                aria-label="Settings"
                onClick={() => navigate('/settings')}
            >
                <Settings size={24} />
            </button>

            {/* Avatar Section */}
            <div className="avatar-section">
                <div className="avatar-circle">
                    <div className="avatar-placeholder">
                        <img src={profileAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
                <h1 className="user-name">{name}</h1>
            </div>

            {/* Cards Grid */}
            <div className="profile-cards-grid">
                {/* Badge Card */}
                <div className="profile-card badge-card" onClick={() => navigate('/badges')}>
                    <div className="card-header">
                        <Award size={24} color="white" />
                        <span>I Tuoi Badge</span>
                    </div>
                    <div className="badge-progress">
                        <svg className="progress-circle" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                className="progress-background"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                className="progress-bar"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                            />
                        </svg>
                        <div className="progress-value">{badges.total}</div>
                    </div>
                </div>

                {/* Mood Card */}
                <div className="profile-card mood-card" onClick={() => navigate('/mood-history')} style={{ cursor: 'pointer' }}>
                    <div className="card-header">
                        <Smile size={24} color="white" />
                        <span>Stato D'Animo</span>
                    </div>
                    <div className="mood-title-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                        <div className="mood-title" style={{ margin: 0 }}>{mood.current}</div>
                    </div>
                    <div className="mood-chart" style={{ opacity: hasMoodData ? 1 : 0.3 }}>
                        {normalizedData.map((height, index) => (
                            <div
                                key={index}
                                className="mood-bar"
                                style={{ height: `${height}%` }}
                            ></div>
                        ))}
                    </div>
                    {!hasMoodData && (
                        <div style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '8px' }}>
                            Nessun dato recente
                        </div>
                    )}
                </div>

                {/* Diary Card */}
                <div className="profile-card profile-diary-card" onClick={() => navigate('/diary')} style={{ cursor: 'pointer' }}>
                    <div className="card-header">
                        <img src={diaryIcon} alt="Diario" className="card-icon" />
                        <span>Diario</span>
                    </div>
                    {diaryData ? (
                        <>
                            <div className="diary-date">{diaryData.date}</div>
                            <p className="diary-text">{diaryData.lastEntry}</p>
                        </>
                    ) : (
                        <p className="diary-text" style={{ color: '#888', fontStyle: 'italic' }}>
                            Inizia a scrivere il tuo diario
                        </p>
                    )}
                </div>

                {/* Questionnaires Card */}
                <div className="profile-card questionnaire-card" onClick={() => navigate('/questionari')}>
                    <div className="card-header">
                        <img src={questionnaireIcon} alt="Questionari" className="card-icon" />
                        <span>Questionari</span>
                    </div>
                    <div className="questionnaire-time">
                        <Clock size={16} />
                        <span>~{questionnairesData.daysAgo} giorni fa...</span>
                    </div>
                    <p className="questionnaire-message">{questionnairesData.message}</p>
                </div>
            </div>


        </div>
    );
};

export default Profile;
