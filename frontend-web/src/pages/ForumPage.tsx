import React, { useState, useEffect } from 'react';
import PsychologistProfile from '../components/PsychologistProfile';
import ForumCategoryFilter from '../components/ForumCategoryFilter';
import ForumQuestionCard from '../components/ForumQuestionCard';
import ForumReplyModal from '../components/ForumReplyModal';
import type { ForumQuestion, ForumCategory, ForumStats, LoadingState } from '../types/forum';
import { fetchForumQuestions, fetchForumStats, answerQuestion, updateAnswer, deleteAnswer } from '../services/forum.service';
import '../css/ForumPage.css';

const ForumPage: React.FC = () => {
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
    const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null);
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

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    const loadData = async () => {
        await Promise.all([loadQuestions(), loadStats()]);
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
        const question = questionsState.data?.find(q => q.risposta?.idRisposta === answerId);
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
        if (!questionsState.data) {
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

        questionsState.data.forEach(q => {
            counts[q.categoria] = (counts[q.categoria] || 0) + 1;
        });

        return counts;
    };

    return (
        <div className="forum-page-container">
            <div className="forum-grid">
                <div className="forum-sidebar">
                    <PsychologistProfile />
                </div>

                <div className="forum-content">
                    <div className="content-panel">
                        <div className="forum-header">
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
                                    <div className="forum-questions-list">
                                        {questionsState.data.map(question => (
                                            <ForumQuestionCard
                                                key={question.idDomanda}
                                                question={question}
                                                onAnswer={handleAnswer}
                                                onEditAnswer={handleEditAnswer}
                                                onDeleteAnswer={handleDeleteAnswer}
                                            />
                                        ))}
                                    </div>
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
