import React, { useState, useEffect } from 'react';
import PsychologistProfile from '../components/PsychologistProfile';
import QuestionnaireTable from '../components/QuestionnaireTable';
import QuestionnaireDetailModal from '../components/QuestionnaireDetailModal';
import { getCurrentUser, getUserRole } from '../services/auth.service';
import { fetchQuestionnaires, requestInvalidation } from '../services/questionnaire.service';
import type { QuestionnaireData, LoadingState } from '../types/psychologist';
import '../css/QuestionnaireManagement.css';

const QuestionnaireManagement: React.FC = () => {
    const [questionnairesState, setQuestionnairesState] = useState<LoadingState<QuestionnaireData[]>>({
        data: null,
        loading: true,
        error: null,
    });
    const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string | null>(null);
    const [viewingQuestionnaire, setViewingQuestionnaire] = useState<QuestionnaireData | null>(null);

    const user = getCurrentUser();
    const role = getUserRole();

    useEffect(() => {
        // Only load if user and role are available
        if (user && role) {
            loadQuestionnaires();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Intentionally empty - we only want to load once on mount

    const loadQuestionnaires = async () => {
        if (!user || !role) {
            setQuestionnairesState({
                data: null,
                loading: false,
                error: 'Utente o ruolo non disponibile',
            });
            return;
        }

        setQuestionnairesState({ data: null, loading: true, error: null });
        try {
            const userRole = role === 'admin' ? 'admin' : 'psychologist';
            const cf = user?.fiscalCode || user?.email;
            const data = await fetchQuestionnaires(userRole, cf);
            setQuestionnairesState({ data, loading: false, error: null });
        } catch (error) {
            setQuestionnairesState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to load questionnaires',
            });
        }
    };

    const handleSelectQuestionnaire = (id: string) => {
        setSelectedQuestionnaireId(id);
    };



    const handleView = (id: string) => {
        const questionnaire = questionnairesState.data?.find(q => q.idQuestionario === id);
        if (questionnaire) {
            setViewingQuestionnaire(questionnaire);
        }
    };

    const handleCloseModal = () => {
        setViewingQuestionnaire(null);
    };

    const handleReview = (id: string) => {
        console.log('Review questionnaire:', id);
        // TODO: Open review modal
        alert(`Revisiona questionario: ${id}`);
    };

    const handleRequestInvalidation = async (id: string, notes: string) => {
        try {
            await requestInvalidation(id, notes);
            alert('Richiesta di invalidazione inviata con successo!');
            loadQuestionnaires();
        } catch (error) {
            console.error('Error requesting invalidation:', error);
            alert('Errore nell\'invio della richiesta di invalidazione');
        }
    };

    const handleUploadNewType = () => {
        console.log('Upload new questionnaire type');
        // TODO: Open upload modal
        alert('Carica nuova tipologia di questionario');
    };

    if (!role) {
        return <div className="error-message">Errore: ruolo utente non trovato</div>;
    }

    return (
        <div className="questionnaire-management-container">
            <div className="management-grid">
                <div className="management-sidebar">
                    <PsychologistProfile />
                </div>

                <div className="management-content">
                    <div className="content-panel">
                        <h2 className="panel-title">Gestione Questionari</h2>
                        <div className="management-header">
                            <div className="header-actions">
                                {role === 'admin' && (
                                    <button
                                        className="upload-btn"
                                        onClick={handleUploadNewType}
                                    >
                                        ⬆ Carica Nuova Tipologia
                                    </button>
                                )}
                            </div>
                        </div>

                        {questionnairesState.loading && (
                            <div className="loading-state">Caricamento questionari...</div>
                        )}

                        {questionnairesState.error && (
                            <div className="error-state">
                                <p>Errore: {questionnairesState.error}</p>
                                <button onClick={loadQuestionnaires} className="retry-btn">
                                    Riprova
                                </button>
                            </div>
                        )}

                        {questionnairesState.data && !questionnairesState.loading && (
                            <QuestionnaireTable
                                questionnaires={questionnairesState.data}
                                role={role === 'admin' ? 'admin' : 'psychologist'}
                                selectedId={selectedQuestionnaireId}
                                onSelect={handleSelectQuestionnaire}
                                onView={handleView}
                                onReview={handleReview}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for viewing questionnaire details */}
            {viewingQuestionnaire && (
                <QuestionnaireDetailModal
                    questionnaire={viewingQuestionnaire}
                    onClose={handleCloseModal}
                    role={role === 'admin' ? 'admin' : 'psychologist'}
                    onRequestInvalidation={handleRequestInvalidation}
                />
            )}
        </div>
    );
};

export default QuestionnaireManagement;
