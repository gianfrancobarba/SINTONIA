import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PsychologistProfile from '../components/PsychologistProfile';
import AdminProfile from '../components/AdminProfile';
import ForumCategoryFilter from '../components/ForumCategoryFilter';
import ForumQuestionCard from '../components/ForumQuestionCard';
import ForumReplyModal from '../components/ForumReplyModal';
import type { ForumQuestion, ForumCategory, ForumStats, LoadingState } from '../types/forum';
import { fetchForumQuestions, fetchForumStats, answerQuestion, updateAnswer, deleteAnswer } from '../services/forum.service';
import { getCurrentUser } from '../services/auth.service';
import '../css/ForumPage.css';

const ForumPage: React.FC = () => {
    const navigate = useNavigate();
    const [questionsState, setQuestionsState] = useState<LoadingState<ForumQuestion[]>>({
        data: null,
        loading: true,
        error: null
    });
    const [allQuestionsState, setAllQuestionsState] = useState<LoadingState<ForumQuestion[]>>({
        data: null,
        loading: false,
        error: null
    });
    const [statsState, setStatsState] = useState<LoadingState<ForumStats>>({
        data: null,
        loading: true,
        error: null
    });
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

    const currentUser = getCurrentUser();
    const isReadOnly = currentUser?.role === 'admin';

    const handleAdminSectionSelect = (section: string) => {
        // When admin selects a non-forum section, navigate back to admin dashboard with the section state
        if (section !== 'forum') {
            navigate('/admin-dashboard', { state: { selectedSection: section } });
        }
    };

    const handlePsychologistSectionSelect = (section: string) => {
        // When psychologist selects a non-forum section, navigate back to dashboard with section state
        if (section === 'questionari') {
            navigate('/questionnaires');
        } else if (section !== 'forum') {
            navigate('/dashboard', { state: { selectedSection: section } });
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadQuestions();
        setCurrentPage(1); // Reset to page 1 when category changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    const loadData = async () => {
        await Promise.all([loadQuestions(), loadStats(), loadAllQuestions()]);
    };

    const loadQuestions = async () => {
        setQuestionsState({ data: null, loading: true, error: null });
        try {
            const questions = await fetchForumQuestions(selectedCategory || undefined);
            setQuestionsState({ data: questions, loading: false, error: null });
        } catch (error) {
            setQuestionsState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Errore nel caricamento delle domande'
            });
        }
    };

    const loadAllQuestions = async () => {
        try {
            const allQuestions = await fetchForumQuestions(); // No category filter
            setAllQuestionsState({ data: allQuestions, loading: false, error: null });
        } catch (error) {
            setAllQuestionsState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Errore nel caricamento delle domande'
            });
        }
    };

    const loadStats = async () => {
        setStatsState({ data: null, loading: true, error: null });
        try {
            const stats = await fetchForumStats();
            setStatsState({ data: stats, loading: false, error: null });
        } catch (error) {
            setStatsState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Errore nel caricamento delle statistiche'
            });
        }
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

    const handleDeleteAnswer = async (answerId: string) => {
        try {
            await deleteAnswer(answerId);
            await loadData();
        } catch (error) {
            console.error('Error deleting answer:', error);
            alert('Errore durante l\'eliminazione della risposta');
        }
    };

    const handleModalSubmit = async (content: string) => {
        try {
            if (modalState.isEditing && modalState.answerId) {
                await updateAnswer(modalState.answerId, content);
            } else if (modalState.question) {
                await answerQuestion(modalState.question.idDomanda, content);
            }
            await loadData();
            setModalState({ isOpen: false, question: null, isEditing: false });
        } catch (error) {
            console.error('Error submitting answer:', error);
            throw error;
        }
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, question: null, isEditing: false });
    };

    const getCategoryCounts = (): Record<ForumCategory, number> => {
        // Use allQuestionsState to show counts for all questions, not just filtered ones
        if (!allQuestionsState.data) {
            return {
                'Ansia': 0,
                'Stress': 0,
                'Tristezza': 0,
                'Vita di coppia': 0,
                'Altro': 0
            };
        }

        const counts: Record<ForumCategory, number> = {
            'Ansia': 0,
            'Stress': 0,
            'Tristezza': 0,
            'Vita di coppia': 0,
            'Altro': 0
        };

        allQuestionsState.data.forEach(q => {
            counts[q.categoria] = (counts[q.categoria] || 0) + 1;
        });

        return counts;
    };

    const getPaginatedQuestions = (): ForumQuestion[] => {
        if (!questionsState.data) return [];
        const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
        const endIndex = startIndex + QUESTIONS_PER_PAGE;
        return questionsState.data.slice(startIndex, endIndex);
    };

    const getTotalPages = (): number => {
        if (!questionsState.data) return 0;
        return Math.ceil(questionsState.data.length / QUESTIONS_PER_PAGE);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="forum-page-container">
            <div className="forum-grid">
                <div className="forum-sidebar">
                    {currentUser?.role === 'admin' ? (
                        <AdminProfile
                            onSelectSection={handleAdminSectionSelect}
                            activeSection="forum"
                        />
                    ) : (
                        <PsychologistProfile
                            onSelectSection={handlePsychologistSectionSelect}
                            activeSection="forum"
                        />
                    )}
                </div>

                <div className="forum-content">
                    <div className="content-panel fade-in">
                        <div className="forum-header">
                            <h1 className="forum-title">Forum di Supporto</h1>
                            <div>
                                <h2 className="panel-title">Forum Pazienti</h2>
                                <p className="panel-subtitle">Rispondi alle domande dei tuoi pazienti</p>
                            </div>
                            {statsState.data && (
                                <div className="forum-stats">
                                    <div className="stat-item">
                                        <span className="stat-value">{statsState.data.totalQuestions}</span>
                                        <span className="stat-label">Totali</span>
                                    </div>
                                    <div className="stat-item stat-unanswered">
                                        <span className="stat-value">{statsState.data.unansweredQuestions}</span>
                                        <span className="stat-label">Da rispondere</span>
                                    </div>
                                    <div className="stat-item stat-answered">
                                        <span className="stat-value">{statsState.data.answeredQuestions}</span>
                                        <span className="stat-label">Risposte</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <ForumCategoryFilter
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                            questionCounts={getCategoryCounts()}
                        />

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
                                {questionsState.data.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-icon">💬</div>
                                        <h3>Nessuna domanda trovata</h3>
                                        <p>
                                            {selectedCategory
                                                ? `Non ci sono domande nella categoria "${selectedCategory}"`
                                                : 'I tuoi pazienti non hanno ancora fatto domande nel forum'
                                            }
                                        </p>
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
                                                    onDeleteAnswer={!isReadOnly ? handleDeleteAnswer : undefined}
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
                </div>
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
        </div>
    );
};

export default ForumPage;
