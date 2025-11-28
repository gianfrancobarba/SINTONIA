import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftArrowIcon from '../assets/icons/LeftArrow.svg';
import BottomNavigation from '../components/BottomNavigation';
import { getStoricoQuestionari } from '../services/questionari.service';
import { startQuestionario } from '../services/questionario.service';
import type { QuestionarioItemDto } from '../types/questionari';
import '../css/Questionari.css';

const Questionari: React.FC = () => {
    const navigate = useNavigate();
    const [questionariDaCompilare, setQuestionariDaCompilare] = useState<QuestionarioItemDto[]>([]);
    const [questionariCompletati, setQuestionariCompletati] = useState<QuestionarioItemDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startingId, setStartingId] = useState<string | null>(null);

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

    const handleCompilaOra = async (q: QuestionarioItemDto) => {
        try {
            setStartingId(q.id);
            console.log('=== STARTING QUESTIONNAIRE ===');
            console.log('Tipologia:', q.titolo);
            const questionarioData = await startQuestionario(q.titolo);
            console.log('=== RECEIVED DATA FROM BACKEND ===');
            console.log('Full data:', JSON.stringify(questionarioData, null, 2));
            console.log('idQuestionario:', questionarioData.idQuestionario);
            console.log('nomeTipologia:', questionarioData.nomeTipologia);
            console.log('domande:', questionarioData.domande);
            console.log('domande length:', questionarioData.domande?.length);
            console.log('domande is array?', Array.isArray(questionarioData.domande));
            // Navigate to static compilation route with data in state
            navigate('/compilation', { state: { questionario: questionarioData } });
        } catch (err) {
            console.error('Errore nell\'avvio del questionario:', err);
            setError('Impossibile avviare il questionario. Riprova.');
        } finally {
            setStartingId(null);
        }
    };

    if (loading) {
        return (
            <div className="questionari-page">
                <div className="questionari-header">
                    <button className="back-button" onClick={() => navigate('/home')}>
                        <img src={LeftArrowIcon} alt="Back" />
                    </button>
                    <h1>Questionari</h1>
                </div>
                <div className="questionari-content">
                    <p style={{ textAlign: 'center', marginTop: '50px' }}>Caricamento...</p>
                </div>
                <BottomNavigation />
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
                <BottomNavigation />
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

                {/* Sezione Questionari Completati */}
                {questionariCompletati.length > 0 && (
                    <section className="questionari-section">
                        <div className="questionari-divider">
                            <span className="divider-text">Completati</span>
                        </div>
                        <div className="questionari-list">
                            {questionariCompletati.map((q) => (
                                <div key={q.id} className="questionario-card completato">
                                    <div className="card-header">
                                        <h3>{q.titolo}</h3>
                                    </div>
                                    <p className="descrizione">{q.descrizione}</p>
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

            <BottomNavigation />
        </div>
    );
};

export default Questionari;

