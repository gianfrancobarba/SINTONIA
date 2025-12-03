import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ForumQuestionCard from '../components/ForumQuestionCard';
import ForumCategoryFilter from '../components/ForumCategoryFilter';
import ForumReplyModal from '../components/ForumReplyModal';
import type { ForumQuestion, LoadingState, ForumCategory } from '../types/forum';
import { fetchForumQuestions, answerQuestion, updateAnswer, deleteAnswer } from '../services/forum.service';
import { getCurrentUser } from '../services/auth.service';
import '../css/ForumPage.css';

type FilterType = 'all' | 'unanswered' | 'answered';

import Toast from '../components/Toast';

const ForumPage: React.FC = () => {
    const [questionsState, setQuestionsState] = useState<LoadingState<ForumQuestion[]>>({
        data: null,
        loading: true,
        error: null
    });
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const QUESTIONS_PER_PAGE = 5;
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        question: ForumQuestion | null;
        existingAnswer?: string;
        answerId?: string;
        isEditing: boolean;
    }>({
        isOpen: false,
        question: null,
        isEditing: false
    });
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [deleteModalState, setDeleteModalState] = useState<{
        isOpen: boolean;
        answerId: string | null;
    }>({
        isOpen: false,
        answerId: null
    });

    const currentUser = getCurrentUser();
    const isReadOnly = currentUser?.role === 'admin';

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        setCurrentPage(1); // Reset to page 1 when filter changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterType]);

    const loadData = async () => {
        await loadQuestions();
    };

    const loadQuestions = async () => {
        setQuestionsState({ data: null, loading: true, error: null });
        try {
            const questions = await fetchForumQuestions();
            setQuestionsState({ data: questions, loading: false, error: null });
        } catch (error) {
            setQuestionsState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Errore nel caricamento delle domande'
            });
        }
    };

    const getStats = () => {
        if (!questionsState.data) return null;

        const totalQuestions = questionsState.data.length;
        const answeredQuestions = questionsState.data.filter(q =>
            q.risposte && q.risposte.length > 0
        ).length;
        const unansweredQuestions = totalQuestions - answeredQuestions;

        return {
            totalQuestions,
            answeredQuestions,
            unansweredQuestions
        };
    };

    const handleAnswer = (questionId: string) => {
        const question = questionsState.data?.find(q => q.idDomanda === questionId);
        if (question) {
            setModalState({
                isOpen: true,
                question,
                isEditing: false
            });
        }
    };

    const handleEditAnswer = (answerId: string, currentText: string) => {
        const question = questionsState.data?.find(q =>
            q.risposte?.some(r => r.idRisposta === answerId)
        );
        if (question) {
            setModalState({
                isOpen: true,
                question,
                existingAnswer: currentText,
                answerId,
                isEditing: true
            });
        }
    };

    const handleDeleteRequest = (answerId: string) => {
        setDeleteModalState({
            isOpen: true,
            answerId
        });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModalState.answerId) return;

        try {
            await deleteAnswer(deleteModalState.answerId);
            await loadData();
            setToast({ message: 'Risposta eliminata con successo!', type: 'success' });
            setDeleteModalState({ isOpen: false, answerId: null });
        } catch (error) {
            console.error('Error deleting answer:', error);
            setToast({ message: 'Errore durante l\'eliminazione della risposta', type: 'error' });
        }
    };

    const handleModalSubmit = async (content: string) => {
        try {
            if (modalState.isEditing && modalState.answerId) {
                await updateAnswer(modalState.answerId, content);
                setToast({ message: 'Risposta modificata con successo!', type: 'success' });
            } else if (modalState.question) {
                await answerQuestion(modalState.question.idDomanda, content);
                setToast({ message: 'Risposta pubblicata con successo!', type: 'success' });
            }
            await loadData();
            setModalState({ isOpen: false, question: null, isEditing: false });
        } catch (error) {
            console.error('Error submitting answer:', error);
            setToast({ message: 'Errore durante il salvataggio della risposta', type: 'error' });
        }
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, question: null, isEditing: false });
    };

    const getFilteredQuestions = (): ForumQuestion[] => {
        if (!questionsState.data) return [];

        let filtered = questionsState.data;

        // Filter by category if selected
        if (selectedCategory) {
            filtered = filtered.filter(q => q.categoria === selectedCategory);
        }

        // Filter by answer status
        switch (filterType) {
            case 'unanswered':
                return filtered.filter(q => !q.risposte || q.risposte.length === 0);
            case 'answered':
                return filtered.filter(q => q.risposte && q.risposte.length > 0);
            case 'all':
            default:
                return filtered;
        }
    };

    const getPaginatedQuestions = (): ForumQuestion[] => {
        const filtered = getFilteredQuestions();
        const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
        const endIndex = startIndex + QUESTIONS_PER_PAGE;
        return filtered.slice(startIndex, endIndex);
    };

    const getTotalPages = (): number => {
        const filtered = getFilteredQuestions();
        return Math.ceil(filtered.length / QUESTIONS_PER_PAGE);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="content-panel fade-in">
            {/* Fixed Header Section */}
            <div className="forum-fixed-header">
                <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    Forum
                </h2>

                {getStats() && (
                    <div className="forum-stats">
                        <button
                            className={`stat-item ${filterType === 'all' ? 'stat-active' : ''}`}
                            onClick={() => setFilterType('all')}
                        >
                            <span className="stat-value">{getStats()!.totalQuestions}</span>
                            <span className="stat-label">Domande Totali</span>
                        </button>
                        <button
                            className={`stat-item stat-unanswered ${filterType === 'unanswered' ? 'stat-active' : ''}`}
                            onClick={() => setFilterType('unanswered')}
                        >
                            <span className="stat-value">{getStats()!.unansweredQuestions}</span>
                            <span className="stat-label">Domande Da rispondere</span>
                        </button>
                        <button
                            className={`stat-item stat-answered ${filterType === 'answered' ? 'stat-active' : ''}`}
                            onClick={() => setFilterType('answered')}
                        >
                            <span className="stat-value">{getStats()!.answeredQuestions}</span>
                            <span className="stat-label">Domande Risposte</span>
                        </button>
                    </div>
                )}

                <ForumCategoryFilter
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </div>

            {/* Scrollable Content Section */}
            <div className="forum-scroll-container">
                {questionsState.loading && (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Caricamento domande...</p>
                    </div>
                )}

                {questionsState.error && (
                    <div className="error-state">
                        <p>❌ {questionsState.error}</p>
                        <button onClick={loadQuestions} className="retry-button">
                            Riprova
                        </button>
                    </div>
                )}

                {questionsState.data && !questionsState.loading && (
                    <>
                        {getFilteredQuestions().length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">💬</div>
                                <h3>Nessuna domanda trovata</h3>
                                <p>Non ci sono domande corrispondenti al filtro selezionato</p>
                            </div>
                        ) : (
                            <>
                                <div className="forum-questions-list">
                                    {getPaginatedQuestions().map(question => (
                                        <ForumQuestionCard
                                            key={question.idDomanda}
                                            question={question}
                                            onAnswer={!isReadOnly ? handleAnswer : undefined}
                                            onEditAnswer={!isReadOnly ? handleEditAnswer : undefined}
                                            onDeleteAnswer={!isReadOnly ? handleDeleteRequest : undefined}
                                        />
                                    ))}
                                </div>

                                {getTotalPages() > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="pagination-button"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            ← Precedente
                                        </button>
                                        <div className="pagination-info">
                                            Pagina {currentPage} di {getTotalPages()}
                                        </div>
                                        <button
                                            className="pagination-button"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === getTotalPages()}
                                        >
                                            Successiva →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {modalState.isOpen && modalState.question && (
                <ForumReplyModal
                    question={modalState.question}
                    existingAnswer={modalState.existingAnswer}
                    isEditing={modalState.isEditing}
                    onClose={handleCloseModal}
                    onSubmit={handleModalSubmit}
                />
            )}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {deleteModalState.isOpen && createPortal(
                <div className="delete-confirm-overlay" onClick={() => setDeleteModalState({ isOpen: false, answerId: null })}>
                    <div className="delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <h3>Conferma eliminazione</h3>
                        <p>Sei sicuro di voler eliminare questa risposta? L'azione non può essere annullata.</p>
                        <div className="delete-confirm-actions">
                            <button
                                className="cancel-button"
                                onClick={() => setDeleteModalState({ isOpen: false, answerId: null })}
                            >
                                Annulla
                            </button>
                            <button
                                className="confirm-delete-button"
                                onClick={handleConfirmDelete}
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ForumPage;
