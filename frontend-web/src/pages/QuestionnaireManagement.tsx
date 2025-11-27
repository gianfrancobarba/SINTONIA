import React, { useState, useEffect } from 'react';
import PsychologistProfile from '../components/PsychologistProfile';
import QuestionnaireTable from '../components/QuestionnaireTable';
import QuestionnaireDetailModal from '../components/QuestionnaireDetailModal';
import { getCurrentUser, getUserRole } from '../services/auth.service';
import { fetchQuestionnaires, fetchQuestionnairesByPatient } from '../services/questionnaire.service';
import type { QuestionnaireData, LoadingState } from '../types/psychologist';
import '../css/QuestionnaireManagement.css';

const QuestionnaireManagement: React.FC = () => {
    const [questionnairesState, setQuestionnairesState] = useState<LoadingState<QuestionnaireData[]>>({
        data: null,
        loading: true,
        error: null,
    });
    const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string | null>(null);
    const [isFiltered, setIsFiltered] = useState(false);
    const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
    const [viewingQuestionnaireId, setViewingQuestionnaireId] = useState<string | null>(null);

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
        // Find the selected questionnaire to get patient ID
        const selected = questionnairesState.data?.find(q => q.idQuestionario === id);
        if (selected) {
            setCurrentPatientId(selected.idPaziente);
        }
    };

    const handleFilterByPatient = async () => {
        if (!currentPatientId) return;

        setQuestionnairesState({ data: questionnairesState.data, loading: true, error: null });
        try {
            const data = await fetchQuestionnairesByPatient(currentPatientId);
            setQuestionnairesState({ data, loading: false, error: null });
            setIsFiltered(true);
        } catch (error) {
            setQuestionnairesState({
                data: questionnairesState.data,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to filter questionnaires',
            });
        }
    };

    const handleClearFilter = () => {
        setIsFiltered(false);
        setSelectedQuestionnaireId(null);
        setCurrentPatientId(null);
        loadQuestionnaires();
    };

    const handleView = (id: string) => {
        setViewingQuestionnaireId(id);
    };

    const handleCloseModal = () => {
        setViewingQuestionnaireId(null);
    };

    const handleReview = (id: string) => {
        console.log('Review questionnaire:', id);
        // TODO: Open review modal
        alert(`Revisiona questionario: ${id}`);
    };

    const handleRequestInvalidation = (id: string) => {
        console.log('Request invalidation:', id);
        // TODO: Open invalidation request modal
        alert(`Richiedi invalidazione questionario: ${id}`);
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
                                {selectedQuestionnaireId && (
                                    <button
                                        className={`filter-btn ${!currentPatientId ? 'disabled' : ''}`}
                                        onClick={handleFilterByPatient}
                                        disabled={!currentPatientId}
                                    >
                                        🔍 Filtra per Paziente
                                    </button>
                                )}

                                {isFiltered && (
                                    <button
                                        className="clear-filter-btn"
                                        onClick={handleClearFilter}
                                    >
                                        ✕ Rimuovi Filtro
                                    </button>
                                )}

                                {role === 'admin' && (
                                    <button
                                        className="upload-btn"
                                        onClick={handleUploadNewType}
                                    >
                                        ⬆ Carica Nuova Tipologia
                                    </button>
                                )}
                            </div>

                            {isFiltered && currentPatientId && (
                                <div className="filter-info">
                                    Filtrando questionari del paziente: <strong>{currentPatientId}</strong>
                                </div>
                            )}
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
                                onRequestInvalidation={handleRequestInvalidation}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for viewing questionnaire details */}
            {viewingQuestionnaireId && (
                <QuestionnaireDetailModal
                    questionnaireId={viewingQuestionnaireId}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default QuestionnaireManagement;
