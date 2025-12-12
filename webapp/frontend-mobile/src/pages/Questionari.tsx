import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LeftArrowIcon from '../assets/icons/LeftArrow.svg';
import { getStoricoQuestionari } from '../services/questionari.service';
import { startQuestionario } from '../services/questionario.service';
import type { QuestionarioItemDto, QuestionnaireCategory } from '../types/questionari';
import '../css/Questionari.css';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const Questionari: React.FC = () => {
    const navigate = useNavigate();
    const [questionariDaCompilare, setQuestionariDaCompilare] = useState<QuestionarioItemDto[]>([]);
    const [questionariCompletati, setQuestionariCompletati] = useState<QuestionarioItemDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startingId, setStartingId] = useState<string | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const location = useLocation();

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

    useEffect(() => {
        const fetchQuestionari = async () => {
            try {
                setLoading(true);
                const data = await getStoricoQuestionari();
                setQuestionariDaCompilare(data.daCompilare);
                setQuestionariCompletati(data.completati);
            } catch (err) {
                console.error('Errore nel caricamento dei questionari:', err);
                setError('Impossibile caricare i questionari. Riprova più tardi.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionari();
    }, []);

    const parseDate = (dateString: string): Date => {
        // Check for DD/MM/YYYY or DD-MM-YYYY format
        const ddmmyyyy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/;
        const match = dateString.match(ddmmyyyy);

        if (match) {
            // match[1] is day, match[2] is month, match[3] is year
            return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
        }
        return new Date(dateString);
    };

    // Group completed questionnaires by category (titolo)
    const groupedCategories = useMemo<QuestionnaireCategory[]>(() => {
        const categoryMap = new Map<string, QuestionarioItemDto[]>();

        questionariCompletati.forEach(q => {
            const existing = categoryMap.get(q.titolo) || [];
            categoryMap.set(q.titolo, [...existing, q]);
        });

        return Array.from(categoryMap.entries()).map(([categoria, questionnaires]) => {
            // Find most recent completion date
            const dates = questionnaires
                .map(q => q.dataCompletamento)
                .filter((d): d is string => !!d)
                .sort((a, b) => parseDate(b).getTime() - parseDate(a).getTime());

            return {
                categoria,
                count: questionnaires.length,
                lastCompletionDate: dates[0] || '',
                questionnaires: questionnaires.sort((a, b) => {
                    if (!a.dataCompletamento || !b.dataCompletamento) return 0;
                    return parseDate(b.dataCompletamento).getTime() - parseDate(a.dataCompletamento).getTime();
                })
            };
        });
    }, [questionariCompletati]);

    const handleCompilaOra = async (q: QuestionarioItemDto) => {
        try {
            setStartingId(q.id);
            const questionarioData = await startQuestionario(q.titolo);
            navigate('/compilation', { state: { questionario: questionarioData } });
        } catch (err) {
            console.error('Errore nell\'avvio del questionario:', err);
            setError('Impossibile avviare il questionario. Riprova.');
        } finally {
            setStartingId(null);
        }
    };

    const toggleCategory = (categoria: string) => {
        setExpandedCategory(expandedCategory === categoria ? null : categoria);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = parseDate(dateString);
        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="questionari-page">
                <div className="questionari-header">
                    <button className="back-button" onClick={() => navigate('/home')}>
                        <img src={LeftArrowIcon} alt="Back" />
                    </button>
                    <h1>Questionari</h1>
                </div>
                <div className="questionari-content">
                    <p style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="questionari-page">
            <div className="questionari-header">
                <button className="back-button" onClick={() => navigate('/home')}>
                    <img src={LeftArrowIcon} alt="Back" />
                </button>
                <h1>Questionari</h1>
            </div>

            <div className="questionari-content">
                {/* Sezione Questionari da Compilare */}
                {questionariDaCompilare.length > 0 && (
                    <section className="questionari-section">
                        <div className="questionari-divider">
                            <span className="divider-text">Da Compilare</span>
                        </div>
                        <div className="questionari-list">
                            {questionariDaCompilare.map((q) => (
                                <div key={q.id} className="questionario-card">
                                    <div className="card-header">
                                        <h3>{q.titolo}</h3>
                                    </div>
                                    <p className="descrizione">{q.descrizione}</p>
                                    <div className="card-footer">
                                        <button
                                            className="compila-button"
                                            onClick={() => handleCompilaOra(q)}
                                            disabled={startingId === q.id}
                                        >
                                            {startingId === q.id ? 'Avvio...' : 'Compila ora'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Sezione Questionari Completati - Raggruppati per Categoria */}
                {groupedCategories.length > 0 && (
                    <section className="questionari-section">
                        <div className="questionari-divider">
                            <span className="divider-text">Completati</span>
                        </div>
                        <div className="questionari-list">
                            {groupedCategories.map((category) => (
                                <div
                                    key={category.categoria}
                                    className={`questionario-card category-card ${expandedCategory === category.categoria ? 'expanded' : ''}`}
                                >
                                    <div
                                        className="category-card-header"
                                        onClick={() => toggleCategory(category.categoria)}
                                    >
                                        <div className="card-header">
                                            <h3>{category.categoria}</h3>
                                            <span className="category-badge">{category.count}</span>
                                        </div>
                                        {category.lastCompletionDate && (
                                            <p className="category-last-date">
                                                Ultimo: {formatDate(category.lastCompletionDate)}
                                            </p>
                                        )}
                                    </div>

                                    {expandedCategory === category.categoria && (
                                        <div className="category-history">
                                            <div className="history-divider"></div>
                                            <div className="history-list">
                                                {category.questionnaires.map((q, index) => (
                                                    <div key={q.id} className="history-item">
                                                        <span className="history-id">#{category.questionnaires.length - index}</span>
                                                        <span className="history-date">
                                                            {q.dataCompletamento ? formatDate(q.dataCompletamento) : 'N/D'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Messaggio se non ci sono questionari */}
                {questionariDaCompilare.length === 0 && questionariCompletati.length === 0 && (
                    <p style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
                        Nessun questionario disponibile al momento.
                    </p>
                )}
            </div>

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

export default Questionari;
