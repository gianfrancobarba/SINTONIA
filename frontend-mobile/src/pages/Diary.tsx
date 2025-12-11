import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DiaryCard from '../components/DiaryCard';
import DateFilter from '../components/DateFilter';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { getDiaryPages, deleteDiaryPage, getAvailableMonthsYears, type MonthYearOption } from '../services/diary.service';
import type { DiaryPage } from '../types/diary';
import Toast from '../components/Toast';
import '../css/Diary.css';
import NewForumQuestionIcon from '../assets/icons/NewForumQuestion.svg';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCache } from '../contexts/CacheContext';

const Diary: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { diaryPages, setDiaryPages, diaryDateOptions, setDiaryDateOptions } = useCache();
    // Helper accessor (memoized pages or just ref), if null use empty array for safety in rendering
    const pages = diaryPages || [];

    // Initialize filteredPages with pages directly to avoid flash
    const [filteredPages, setFilteredPages] = useState<DiaryPage[]>(pages);
    const [currentIndex, setCurrentIndex] = useState(0);
    // Loading is true only if we don't have cached data yet
    const [loading, setLoading] = useState(!diaryPages);
    const [error, setError] = useState<string | null>(null);

    // Date filter
    const dateOptions = diaryDateOptions || [];
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

    // Delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pageToDelete, setPageToDelete] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Touch gesture state
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                if (!diaryPages) setLoading(true);
                setError(null);

                const [fetchedPages, options] = await Promise.all([
                    getDiaryPages(),
                    getAvailableMonthsYears()
                ]);

                setDiaryPages(fetchedPages);
                setDiaryDateOptions(options);
            } catch (err) {
                console.error('Error loading diary data:', err);
                setError('Errore nel caricamento delle pagine');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    useEffect(() => {
        // Filtra le pagine quando cambiano i filtri o le pagine
        filterPagesByDate();
    }, [pages, selectedMonth, selectedYear]);

    // Handle Toast from navigation state
    useEffect(() => {
        const state = location.state as { toastMessage?: string; toastType?: 'success' | 'error' } | null;
        if (state?.toastMessage) {
            setToast({
                message: state.toastMessage,
                type: state.toastType || 'success'
            });
            // Clear state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const loadDiaryPages = async () => {
        try {
            if (!diaryPages) setLoading(true);
            setError(null);
            const fetchedPages = await getDiaryPages();
            setDiaryPages(fetchedPages);
        } catch (err) {
            console.error('Error loading diary pages:', err);
            setError('Errore nel caricamento delle pagine');
        } finally {
            setLoading(false);
        }
    };

    const filterPagesByDate = () => {
        if (selectedMonth === undefined && selectedYear === undefined) {
            setFilteredPages(pages);
            setCurrentIndex(0);
            return;
        }

        const filtered = pages.filter(page => {
            const pageDate = new Date(page.createdAt);
            const matchMonth = selectedMonth === undefined || pageDate.getMonth() === selectedMonth;
            const matchYear = selectedYear === undefined || pageDate.getFullYear() === selectedYear;
            return matchMonth && matchYear;
        });

        setFilteredPages(filtered);
        setCurrentIndex(0);
    };

    const handleDateFilterChange = (month?: number, year?: number) => {
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    const handleSwipeLeft = () => {
        if (currentIndex < filteredPages.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleSwipeRight = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Touch gesture handlers
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleSwipeLeft();
        }
        if (isRightSwipe) {
            handleSwipeRight();
        }
    };

    const handleAddPage = () => {
        navigate('/new-diary-page');
    };

    const handleEdit = (id: string) => {
        const page = pages.find(p => p.id === id);
        if (page) {
            navigate('/edit-diary-page', { state: { page } });
        }
    };

    const handleDelete = (id: string) => {
        setPageToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!pageToDelete) return;

        try {
            await deleteDiaryPage(pageToDelete);
            const updatedPages = await getDiaryPages();
            setDiaryPages(updatedPages);

            // Aggiusta l'indice se necessario
            if (currentIndex >= updatedPages.length && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }

            setShowDeleteModal(false);
            setPageToDelete(null);
            setToast({ message: 'Pagina eliminata con successo!', type: 'success' });
        } catch (err) {
            console.error('Error deleting page:', err);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setPageToDelete(null);
    };

    const getCardPosition = (index: number): 'center' | 'left' | 'right' | 'hidden' => {
        if (index === currentIndex) return 'center';
        if (index === currentIndex - 1) return 'left';
        if (index === currentIndex + 1) return 'right';
        return 'hidden';
    };

    const getCardZIndex = (index: number): number => {
        const distance = Math.abs(currentIndex - index);
        return 100 - distance;
    };

    if (loading && !diaryPages) {
        return (
            <div className="loading-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="diary-page">
                <div className="diary-header">
                    <div className="diary-header-content">
                        <div className="diary-title-section">
                            <h1 className="diary-title">Diario</h1>

                        </div>
                        <button className="add-diary-button" onClick={handleAddPage} aria-label="Aggiungi pagina">
                            +
                        </button>
                    </div>
                </div>
                <div className="diary-empty">
                    <p>{error}</p>
                    <button onClick={loadDiaryPages} className="retry-btn">Riprova</button>
                </div>

            </div>
        );
    }

    if (pages.length === 0) {
        return (
            <div className="diary-page">
                <div className="diary-header">
                    <div className="diary-header-content">
                        <div className="diary-title-section">
                            <h1 className="diary-title">Diario</h1>

                        </div>
                        <button className="add-diary-button" onClick={handleAddPage} aria-label="Aggiungi pagina">
                            +
                        </button>
                    </div>
                </div>
                <div className="diary-empty">
                    <p>Nessuna pagina nel diario</p>
                    <p className="diary-empty-hint">Inizia a scrivere il tuo primo pensiero</p>
                </div>

            </div>
        );
    }

    return (
        <div className="diary-page">
            <div className="diary-header">
                <div className="diary-header-content">
                    <div className="diary-title-section">
                        <h1 className="diary-title">Diario</h1>

                    </div>
                </div>
            </div>

            <div className="diary-main-card">
                {dateOptions.length > 1 && (
                    <DateFilter
                        options={dateOptions}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onFilterChange={handleDateFilterChange}
                    />
                )}

                {filteredPages.length === 0 ? (
                    <div className="diary-empty">
                        <p>Nessuna pagina trovata per questo periodo</p>
                        <p className="diary-empty-hint">Prova a selezionare un altro mese</p>
                    </div>
                ) : (
                    <>
                        <div
                            className="diary-content"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            <div className="diary-cards-container">
                                {filteredPages.map((page, index) => (
                                    <DiaryCard
                                        key={page.id}
                                        page={page}
                                        position={getCardPosition(index)}
                                        zIndex={getCardZIndex(index)}
                                        onSwipeLeft={currentIndex < filteredPages.length - 1 ? handleSwipeLeft : undefined}
                                        onSwipeRight={currentIndex > 0 ? handleSwipeRight : undefined}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>

                            <div className="diary-indicator">
                                <span className="diary-page-counter">
                                    {currentIndex + 1} / {filteredPages.length}
                                </span>
                            </div>
                        </div>
                    </>
                )}

                <div className="diary-fab-container">
                    <button
                        className="diary-fab"
                        onClick={handleAddPage}
                        aria-label="Nuova pagina"
                    >
                        <img src={NewForumQuestionIcon} alt="" />
                    </button>
                </div>
            </div>



            {showDeleteModal && (
                <ConfirmDeleteModal
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}

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

export default Diary;
