import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import AdminQuestionnaireTable from '../components/AdminQuestionnaireTable';
import AdminQuestionnaireDetailModal from '../components/AdminQuestionnaireDetailModal';
import { fetchQuestionnaires, fetchQuestionnairesByPatient, cancelRevision, viewQuestionnaire } from '../services/questionnaire.service';
import type { QuestionnaireData, LoadingState } from '../types/psychologist';
import '../css/QuestionnaireManagement.css'; // Reuse existing layout styles

import Toast from '../components/Toast';

const AdminQuestionnaireList: React.FC = () => {
    const [questionnairesState, setQuestionnairesState] = useState<LoadingState<QuestionnaireData[]>>({
        data: null,
        loading: true,
        error: null,
    });
    const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string | null>(null);
    const [viewingQuestionnaire, setViewingQuestionnaire] = useState<QuestionnaireData | null>(null);
    const [patientFilter, setPatientFilter] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        loadQuestionnaires();
    }, []);

    const loadQuestionnaires = async (patientIdFilter?: string) => {
        setQuestionnairesState({ data: null, loading: true, error: null });
        try {
            let data: QuestionnaireData[];
            if (patientIdFilter) {
                data = await fetchQuestionnairesByPatient('admin', patientIdFilter);
            } else {
                data = await fetchQuestionnaires('admin');
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
                loadQuestionnaires(selectedQ.idPaziente);
            }
        }
    };

    const handleResetFilter = () => {
        setPatientFilter(null);
        setSelectedQuestionnaireId(null);
        loadQuestionnaires();
    };

    const handleView = async (id: string) => {
        try {
            const questionnaireDetails = await viewQuestionnaire(id, 'admin');
            setViewingQuestionnaire(questionnaireDetails);
        } catch (error) {
            console.error('Error loading questionnaire details:', error);
            setToast({ message: 'Errore nel caricamento dei dettagli del questionario', type: 'error' });
        }
    };

    const handleCloseModal = () => {
        setViewingQuestionnaire(null);
    };

    const handleCancelRevision = async (id: string) => {
        try {
            await cancelRevision(id);
            setToast({ message: 'Revisione annullata con successo', type: 'success' });
            // Reload with current filter if active
            loadQuestionnaires(patientFilter || undefined);
        } catch (error) {
            console.error('Error cancelling revision:', error);
            setToast({ message: 'Errore durante l\'annullamento della revisione', type: 'error' });
        }
    };

    return (
        <div className="content-panel" style={{ height: '100%', boxSizing: 'border-box' }}>
            <h2 className="panel-title">Lista Questionari</h2>

            <div className="management-header">
                <div className="header-actions">
                    {/* Filter Controls */}
                </div>
            </div>

            {questionnairesState.loading && (
                <div className="loading-state">Caricamento questionari...</div>
            )}

            {questionnairesState.error && (
                <div className="error-state">
                    <p>Errore: {questionnairesState.error}</p>
                    <button onClick={() => loadQuestionnaires(patientFilter || undefined)} className="retry-btn">
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
                                <span>Filtro attivo: Paziente {patientFilter.substring(0, 8)}...</span>
                                <button className="reset-filter-btn" onClick={handleResetFilter} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <X size={14} />
                                    Rimuovi Filtro
                                </button>
                            </div>
                        )}
                    </div>

                    <AdminQuestionnaireTable
                        questionnaires={questionnairesState.data}
                        selectedId={selectedQuestionnaireId}
                        onSelect={handleSelectQuestionnaire}
                        onView={handleView}
                    />
                </>
            )}

            {/* Modal for viewing questionnaire details (Admin version) */}
            {viewingQuestionnaire && (
                <AdminQuestionnaireDetailModal
                    questionnaire={viewingQuestionnaire}
                    onClose={handleCloseModal}
                    onCancelRevision={handleCancelRevision}
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

export default AdminQuestionnaireList;
