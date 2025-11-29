import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PsychologistProfile from '../components/PsychologistProfile';
import AdminProfile from '../components/AdminProfile';
import ForumQuestionCard from '../components/ForumQuestionCard';
import ForumReplyModal from '../components/ForumReplyModal';
import type { ForumQuestion, ForumStats, LoadingState } from '../types/forum';
import { fetchForumQuestions, fetchForumStats, answerQuestion, updateAnswer, deleteAnswer } from '../services/forum.service';
import { getCurrentUser } from '../services/auth.service';
import '../css/ForumPage.css';

type FilterType = 'all' | 'unanswered' | 'answered';

const ForumPage: React.FC = () => {
    const navigate = useNavigate();
    const [questionsState, setQuestionsState] = useState<LoadingState<ForumQuestion[]>>({
        data: null,
        loading: true,
        error: null
    });
    const [statsState, setStatsState] = useState<LoadingState<ForumStats>>({
        data: null,
        loading: true,
        error: null
    });
    const [filterType, setFilterType] = useState<FilterType>('all');
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
        setCurrentPage(1); // Reset to page 1 when filter changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterType]);

    const loadData = async () => {
        await Promise.all([loadQuestions(), loadStats()]);
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

    const getFilteredQuestions = (): ForumQuestion[] => {
        if (!questionsState.data) return [];

        switch (filterType) {
            case 'unanswered':
                return questionsState.data.filter(q => !q.risposte || q.risposte.length === 0);
            case 'answered':
                return questionsState.data.filter(q => q.risposte && q.risposte.length > 0);
            case 'all':
            default:
                return questionsState.data;
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
                            <h1 className="forum-title">Forum</h1>
                        </div>

                        {statsState.data && (
                            <div className="forum-stats">
                                <button
                                    className={`stat-item ${filterType === 'all' ? 'stat-active' : ''}`}
                                    onClick={() => setFilterType('all')}
                                >
                                    <span className="stat-value">{statsState.data.totalQuestions}</span>
                                    <span className="stat-label">Totali</span>
                                </button>
                                <button
                                    className={`stat-item stat-unanswered ${filterType === 'unanswered' ? 'stat-active' : ''}`}
                                    onClick={() => setFilterType('unanswered')}
                                >
                                    <span className="stat-value">{statsState.data.unansweredQuestions}</span>
                                    <span className="stat-label">Da rispondere</span>
                                </button>
                                <button
                                    className={`stat-item stat-answered ${filterType === 'answered' ? 'stat-active' : ''}`}
                                    onClick={() => setFilterType('answered')}
                                >
                                    <span className="stat-value">{statsState.data.answeredQuestions}</span>
                                    <span className="stat-label">Risposte</span>
                                </button>
                            </div>
                        )}

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
