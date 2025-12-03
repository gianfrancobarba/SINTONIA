import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import QuestionnaireTable from '../components/QuestionnaireTable';
import QuestionnaireDetailModal from '../components/QuestionnaireDetailModal';
import { getCurrentUser, getUserRole } from '../services/auth.service';
import { fetchQuestionnaires, fetchQuestionnairesByPatient, requestInvalidation, reviewQuestionnaire, viewQuestionnaire } from '../services/questionnaire.service';
import type { QuestionnaireData, LoadingState } from '../types/psychologist';
import '../css/QuestionnaireManagement.css';

import Toast from '../components/Toast';

const QuestionnaireManagement: React.FC = () => {
    const [questionnairesState, setQuestionnairesState] = useState<LoadingState<QuestionnaireData[]>>({
        data: null,
        loading: true,
        error: null,
    });
    const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string | null>(null);
    const [viewingQuestionnaire, setViewingQuestionnaire] = useState<QuestionnaireData | null>(null);
    const [patientFilter, setPatientFilter] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const user = getCurrentUser();
    const role = getUserRole();

    useEffect(() => {
        // Only load if user and role are available
        if (user && role) {
            loadQuestionnaires();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Intentionally empty - we only want to load once on mount

    const loadQuestionnaires = async (patientIdFilter?: string) => {
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
            let data: QuestionnaireData[];

            if (patientIdFilter) {
                // Call backend API with patient filter
                data = await fetchQuestionnairesByPatient(userRole, patientIdFilter);
            } else {
                // Call backend API for all questionnaires
                const cf = user?.fiscalCode || user?.email;
                data = await fetchQuestionnaires(userRole, cf);
            }

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

    const handleFilterByPatient = () => {
        if (selectedQuestionnaireId) {
            const selectedQ = questionnairesState.data?.find(q => q.idQuestionario === selectedQuestionnaireId);
            if (selectedQ) {
                setPatientFilter(selectedQ.idPaziente);
                // Call backend to fetch filtered data
                loadQuestionnaires(selectedQ.idPaziente);
            }
        }
    };

    const handleResetFilter = () => {
        setPatientFilter(null);
        setSelectedQuestionnaireId(null);
        // Reload all questionnaires from backend
        loadQuestionnaires();
    };

    const handleView = async (id: string) => {
        try {
            const userRole = role === 'admin' ? 'admin' : 'psychologist';
            const questionnaireDetails = await viewQuestionnaire(id, userRole);
            setViewingQuestionnaire(questionnaireDetails);
        } catch (error) {
            console.error('Error loading questionnaire details:', error);
            setToast({ message: 'Errore nel caricamento dei dettagli del questionario', type: 'error' });
        }
    };

    const handleCloseModal = () => {
        setViewingQuestionnaire(null);
    };

    const handleReview = async (id: string) => {
        try {
            await reviewQuestionnaire(id);
            setToast({ message: 'Questionario revisionato con successo!', type: 'success' });
            loadQuestionnaires(patientFilter || undefined);
        } catch (error) {
            console.error('Error reviewing questionnaire:', error);
            setToast({ message: 'Errore durante la revisione del questionario', type: 'error' });
        }
    };

    const handleRequestInvalidation = async (id: string, notes: string) => {
        try {
            await requestInvalidation(id, notes);
            setToast({ message: 'Richiesta di invalidazione inviata con successo!', type: 'success' });
            loadQuestionnaires();
        } catch (error) {
            console.error('Error requesting invalidation:', error);
            setToast({ message: 'Errore nell\'invio della richiesta di invalidazione', type: 'error' });
        }
    };

    const handleUploadNewType = () => {
        console.log('Upload new questionnaire type');
        // TODO: Open upload modal
        setToast({ message: 'Carica nuova tipologia di questionario', type: 'success' });
    };

    if (!role) {
        return <div className="error-message">Errore: ruolo utente non trovato</div>;
    }

    return (
        <div className="content-panel fade-in">
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

            {questionnairesState.error && (
                <div className="error-state">
                    <p>Errore: {questionnairesState.error}</p>
                    <button onClick={() => loadQuestionnaires()} className="retry-btn">
                        Riprova
                    </button>
                </div>
            )}

            {questionnairesState.data && !questionnairesState.loading && (
                <>
                    <div className="filter-controls">
                        <button
                            className="filter-btn"
                            onClick={handleFilterByPatient}
                            disabled={!selectedQuestionnaireId}
                            title={selectedQuestionnaireId ? "Filtra questionari per questo paziente" : "Seleziona un questionario per filtrare"}
                        >
                            Filtra per Paziente
                        </button>
                        {patientFilter && (
                            <div className="active-filter">
                                <span>Filtro attivo</span>
                                <button className="reset-filter-btn" onClick={handleResetFilter} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <X size={14} />
                                    Rimuovi Filtro
                                </button>
                            </div>
                        )}
                    </div>
                    <QuestionnaireTable
                        questionnaires={questionnairesState.data}
                        role={role === 'admin' ? 'admin' : 'psychologist'}
                        selectedId={selectedQuestionnaireId}
                        onSelect={handleSelectQuestionnaire}
                        onView={handleView}
                        onReview={handleReview}
                    />
                </>
            )}

            {/* Modal for viewing questionnaire details */}
            {viewingQuestionnaire && (
                <QuestionnaireDetailModal
                    questionnaire={viewingQuestionnaire}
                    onClose={handleCloseModal}
                    role={role === 'admin' ? 'admin' : 'psychologist'}
                    onRequestInvalidation={handleRequestInvalidation}
                    onReview={handleReview}
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

export default QuestionnaireManagement;
