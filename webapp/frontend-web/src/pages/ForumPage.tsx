import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle } from 'lucide-react';
import ForumQuestionCard from '../components/ForumQuestionCard';
import ForumCategoryFilter from '../components/ForumCategoryFilter';
import PageHeader from '../components/PageHeader';
import type { ForumQuestion, LoadingState, ForumCategory } from '../types/forum';
import { fetchForumQuestions, answerQuestion, updateAnswer, deleteAnswer } from '../services/forum.service';
import { getCurrentUser } from '../services/auth.service';
import '../css/ForumPage.css';
import '../css/EmptyState.css';
import CompactPagination from '../components/CompactPagination';

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
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [deleteModalState, setDeleteModalState] = useState<{
        isOpen: boolean;
        answerId: string | null;
    }>({
        isOpen: false,
        answerId: null
    });

    // State for inline editing
    const [editingState, setEditingState] = useState<{
        answerId: string | null;
        content: string;
    }>({
        answerId: null,
        content: ''
    });

    const currentUser = getCurrentUser();
    const isReadOnly = currentUser?.role === 'admin';

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        setCurrentPage(1); // Reset to page 1 when filter or category changes
        // Scroll to top when filter or category changes
        const scrollContainer = document.querySelector('.forum-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [filterType, selectedCategory]);

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
        const user = getCurrentUser();
        const myFiscalCode = user?.fiscalCode;

        // Filter by category first if selected
        let baseQuestions = questionsState.data;
        if (selectedCategory) {
            baseQuestions = baseQuestions.filter(q => q.categoria === selectedCategory);
        }

        const totalQuestions = baseQuestions.length;

        // Count questions with no answers
        const unansweredQuestions = baseQuestions.filter(q =>
            !q.risposte || q.risposte.length === 0
        ).length;

        // For admin: count all questions with at least one answer
        // For psychologist: count questions where *I* have answered
        const answeredQuestions = isReadOnly
            ? baseQuestions.filter(q => q.risposte && q.risposte.length > 0).length
            : baseQuestions.filter(q =>
                q.risposte && q.risposte.some(r => r.idPsicologo === myFiscalCode)
            ).length;

        return {
            totalQuestions,
            answeredQuestions,
            unansweredQuestions
        };
    };

    // Inline answer submission
    const handleInlineSubmit = async (questionId: string, content: string) => {
        try {
            await answerQuestion(questionId, content);
            setToast({ message: 'Risposta pubblicata con successo!', type: 'success' });
            await loadData();
        } catch (error) {
            console.error('Error submitting answer:', error);
            setToast({ message: 'Errore durante il salvataggio della risposta', type: 'error' });
            throw error; // Re-throw to let the card handle it
        }
    };

    const handleEditAnswer = (answerId: string, currentText: string) => {
        setEditingState({
            answerId,
            content: currentText
        });
    };

    const handleEditSubmit = async (answerId: string, content: string) => {
        try {
            await updateAnswer(answerId, content);
            setToast({ message: 'Risposta modificata con successo!', type: 'success' });
            setEditingState({ answerId: null, content: '' });
            await loadData();
        } catch (error) {
            console.error('Error updating answer:', error);
            setToast({ message: 'Errore durante la modifica della risposta', type: 'error' });
        }
    };

    const handleEditCancel = () => {
        setEditingState({ answerId: null, content: '' });
    };

    const handleEditContentChange = (content: string) => {
        setEditingState(prev => ({ ...prev, content }));
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

    const getFilteredQuestions = (): ForumQuestion[] => {
        if (!questionsState.data) return [];
        const user = getCurrentUser();
        const myFiscalCode = user?.fiscalCode;

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
                // Admin: show all questions with at least one answer
                // Psychologist: show questions where *I* have answered
                if (isReadOnly) {
                    return filtered.filter(q => q.risposte && q.risposte.length > 0);
                }
                return filtered.filter(q =>
                    q.risposte && q.risposte.some(r => r.idPsicologo === myFiscalCode)
                );
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
        // Scroll to top of the questions list when changing page
        const scrollContainer = document.querySelector('.forum-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="content-panel fade-in">
            {/* Fixed Header Section */}
            <div className="forum-fixed-header">
                <PageHeader
                    title="Forum"
                    subtitle="Rispondi alle domande dei pazienti"
                    icon={<MessageCircle size={24} />}
                />

                {/* Compact Filter Pills */}
                <div className="forum-filters">
                    <button
                        className={`filter-pill ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        Tutte ({getStats()?.totalQuestions || 0})
                    </button>
                    <button
                        className={`filter-pill ${filterType === 'unanswered' ? 'active' : ''}`}
                        onClick={() => setFilterType('unanswered')}
                    >
                        Da rispondere ({getStats()?.unansweredQuestions || 0})
                    </button>
                    <button
                        className={`filter-pill ${filterType === 'answered' ? 'active' : ''}`}
                        onClick={() => setFilterType('answered')}
                    >
                        {isReadOnly ? 'Domande risposte' : 'Le mie risposte'} ({getStats()?.answeredQuestions || 0})
                    </button>
                </div>

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
                            <div className="unified-empty-state">
                                <div className="unified-empty-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <h3 className="unified-empty-title">Nessuna Domanda</h3>
                                <p className="unified-empty-message">
                                    Non ci sono domande con i filtri selezionati.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="forum-questions-list">
                                    {getPaginatedQuestions().map(question => (
                                        <ForumQuestionCard
                                            key={question.idDomanda}
                                            question={question}
                                            onSubmitAnswer={!isReadOnly ? handleInlineSubmit : undefined}
                                            onEditAnswer={!isReadOnly ? handleEditAnswer : undefined}
                                            onDeleteAnswer={!isReadOnly ? handleDeleteRequest : undefined}
                                            editingAnswerId={editingState.answerId}
                                            editingContent={editingState.content}
                                            onEditSubmit={handleEditSubmit}
                                            onEditCancel={handleEditCancel}
                                            onEditContentChange={handleEditContentChange}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Fixed Pagination Footer */}
            <CompactPagination
                currentPage={currentPage}
                totalPages={getTotalPages()}
                onPageChange={handlePageChange}
            />
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
