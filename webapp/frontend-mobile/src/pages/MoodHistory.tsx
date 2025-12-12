import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { getMoodHistory, type MoodHistoryEntry } from '../services/mood.service';
import { MOOD_CONFIGS } from '../types/mood';
import MoodIcon from '../components/MoodIcons';
import LeftArrowIcon from '../assets/icons/LeftArrow.svg';
import RightArrowIcon from '../assets/icons/RightArrow.svg';
import '../css/MoodHistory.css';
import LoadingSpinner from '../components/LoadingSpinner';

const MoodHistory: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [entries, setEntries] = useState<MoodHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<MoodHistoryEntry | null>(null);

    // Month/Year navigation
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const monthNames = [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const data = await getMoodHistory(365);
                setEntries(data.entries);
            } catch (err) {
                console.error('Error fetching mood history:', err);
                setError('Errore nel caricamento dello storico');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Check for openDate in navigation state
    useEffect(() => {
        if (entries.length > 0 && location.state && (location.state as any).openDate) {
            const targetDate = (location.state as any).openDate;
            const entryToOpen = entries.find(e => e.date === targetDate);

            if (entryToOpen) {
                // Ensure we are viewing the correct month/year
                const entryDate = new Date(entryToOpen.date);
                setCurrentMonth(entryDate.getMonth());
                setCurrentYear(entryDate.getFullYear());

                setSelectedEntry(entryToOpen);

                // Clear state to prevent reopening on reload (optional, but cleaner)
                window.history.replaceState({}, document.title);
            }
        }
    }, [entries, location.state]);

    // Filter entries by current month/year
    const filteredEntries = useMemo(() => {
        return entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [entries, currentMonth, currentYear]);

    // Get mood color from config
    const getMoodColor = (umore: string): string => {
        const config = MOOD_CONFIGS.find(m => m.umore === umore);
        return config?.color || '#8E8E93';
    };

    // Navigate months
    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        const now = new Date();
        const isCurrentMonth = currentMonth === now.getMonth() && currentYear === now.getFullYear();
        if (isCurrentMonth) return;

        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const isNextDisabled = () => {
        const now = new Date();
        return currentMonth === now.getMonth() && currentYear === now.getFullYear();
    };

    // Format date for display
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const weekday = date.toLocaleDateString('it-IT', { weekday: 'short' });
        return `${day} ${weekday.charAt(0).toUpperCase() + weekday.slice(1)}`;
    };

    // Format full date for modal
    const formatFullDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('it-IT', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Handle card click
    const handleCardClick = (entry: MoodHistoryEntry) => {
        setSelectedEntry(entry);
    };

    // Close modal
    const closeModal = () => {
        setSelectedEntry(null);
    };

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="mood-history-page">
            {/* Header - NewDiaryPage style */}
            <header className="mood-history-header">
                <div className="header-content">
                    <button className="back-button" onClick={() => navigate('/profile')} aria-label="Indietro">
                        <img src={LeftArrowIcon} alt="" />
                    </button>
                    <h1 className="header-title">Storico Umore</h1>
                </div>
            </header>

            {/* Main Content Card */}
            <div className="mood-history-main-card">
                {/* Month Navigator - Calendar style arrows */}
                <div className="month-navigator">
                    <button className="nav-arrow" onClick={goToPreviousMonth} aria-label="Mese precedente">
                        <img src={LeftArrowIcon} alt="Previous" />
                    </button>
                    <div className="month-display">
                        <span className="month-name">{monthNames[currentMonth]} {currentYear}</span>
                    </div>
                    <button
                        className={`nav-arrow ${isNextDisabled() ? 'disabled' : ''}`}
                        onClick={goToNextMonth}
                        disabled={isNextDisabled()}
                        aria-label="Mese successivo"
                    >
                        <img src={RightArrowIcon} alt="Next" />
                    </button>
                </div>

                {/* Content */}
                <div className="mood-history-content">
                    {error ? (
                        <div className="mood-history-empty">
                            <p>{error}</p>
                        </div>
                    ) : filteredEntries.length === 0 ? (
                        <div className="mood-history-empty">
                            <div className="empty-icon">📅</div>
                            <p>Nessun dato per questo mese</p>
                            <p className="empty-hint">Inizia a registrare il tuo umore quotidiano</p>
                        </div>
                    ) : (
                        <div className="mood-entries-grid">
                            {filteredEntries.map(entry => {
                                const moodColor = getMoodColor(entry.umore);

                                return (
                                    <div
                                        key={entry.id}
                                        className="mood-entry-card"
                                        onClick={() => handleCardClick(entry)}
                                    >
                                        <div className="card-date">{formatDate(entry.date)}</div>
                                        <div className="card-mood-row">
                                            <div className="mood-icon-wrapper">
                                                <MoodIcon mood={entry.umore as any} size={48} />
                                            </div>
                                            <div className="mood-info">
                                                <span className="mood-name">{entry.umore}</span>
                                                {entry.intensita && (
                                                    <div className="intensity-row">
                                                        <div className="intensity-bar">
                                                            <div
                                                                className="intensity-fill"
                                                                style={{
                                                                    width: `${entry.intensita * 10}%`,
                                                                    backgroundColor: moodColor
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="intensity-value">{entry.intensita}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {entry.note && entry.note.trim() !== '' && (
                                            <div className="card-notes">
                                                <p className="notes-text">{entry.note}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* FAB - Add Mood */}
                <button
                    className="mood-fab"
                    onClick={() => navigate('/mood-entry')}
                    aria-label="Aggiungi stato d'animo"
                >
                    <Plus size={28} color="white" />
                </button>
            </div>

            {/* Detail Modal */}
            {selectedEntry && (
                <div className="mood-detail-overlay" onClick={handleBackdropClick}>
                    <div className="mood-detail-modal">
                        <button className="modal-close-btn" onClick={closeModal} aria-label="Chiudi">
                            <X size={24} />
                        </button>

                        <div className="modal-header">
                            <MoodIcon mood={selectedEntry.umore as any} size={80} />
                            <h2 className="modal-mood-name">{selectedEntry.umore}</h2>
                            <p className="modal-date">{formatFullDate(selectedEntry.date)}</p>
                        </div>

                        {selectedEntry.intensita && (
                            <div className="modal-intensity">
                                <span className="intensity-label">Intensità</span>
                                <div className="modal-intensity-bar">
                                    <div
                                        className="modal-intensity-fill"
                                        style={{
                                            width: `${selectedEntry.intensita * 10}%`,
                                            backgroundColor: getMoodColor(selectedEntry.umore)
                                        }}
                                    ></div>
                                </div>
                                <span className="modal-intensity-value">{selectedEntry.intensita}/10</span>
                            </div>
                        )}

                        {selectedEntry.note && selectedEntry.note.trim() !== '' && (
                            <div className="modal-notes">
                                <span className="notes-label">Note</span>
                                <p className="modal-notes-text">{selectedEntry.note}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoodHistory;
