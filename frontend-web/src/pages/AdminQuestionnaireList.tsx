import React, { useState, useEffect } from 'react';
import { X, Search, RotateCcw } from 'lucide-react';
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

    // Stati per la ricerca live
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredQuestionnaires, setFilteredQuestionnaires] = useState<QuestionnaireData[]>([]);

    useEffect(() => {
        loadQuestionnaires();
    }, []);

    // Effetto per filtrare questionari in tempo reale
    useEffect(() => {
        if (!questionnairesState.data) return;

        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            // Nessuna ricerca, mostra tutti
            setFilteredQuestionnaires(questionnairesState.data);
        } else {
            // Filtra per ID parziale (case insensitive)
            const filtered = questionnairesState.data.filter(questionnaire =>
                questionnaire.idQuestionario.toLowerCase().includes(query)
            );
            setFilteredQuestionnaires(filtered);
        }
    }, [searchQuery, questionnairesState.data]);

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
            setFilteredQuestionnaires(data);
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

    // Gestione input ricerca (live)
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Reset ricerca
    const handleResetSearch = () => {
        setSearchQuery('');
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
                    {/* Barra di ricerca compatta - sopra la tabella a destra */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        gap: '16px'
                    }}>
                        <div className="filter-controls" style={{ margin: 0 }}>
                            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                                {searchQuery ? (
                                    <>Trovati: {filteredQuestionnaires.length} questionari</>
                                ) : (
                                    <>Totale questionari: {questionnairesState.data.length}</>
                                )}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                placeholder="Cerca per ID questionario..."
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: '2px solid #ddd',
                                    fontSize: '14px',
                                    width: '280px',
                                    transition: 'border-color 0.2s ease',
                                    outline: 'none',
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#83B9C1'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            />
                            {searchQuery && (
                                <button onClick={handleResetSearch} className="clear-filter-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <RotateCcw size={14} />
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tabella questionari o messaggio vuoto */}
                    {filteredQuestionnaires.length > 0 ? (
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
                                questionnaires={filteredQuestionnaires}
                                selectedId={selectedQuestionnaireId}
                                onSelect={handleSelectQuestionnaire}
                                onView={handleView}
                            />
                        </>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            background: '#f8f9fa',
                            borderRadius: '8px',
                            marginTop: '20px'
                        }}>
                            <p style={{
                                fontSize: '16px',
                                color: '#666',
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}>
                                <Search size={18} style={{ flexShrink: 0 }} />
                                <span>Nessun questionario trovato con ID "<strong>{searchQuery}</strong>"</span>
                            </p>
                            <p style={{
                                fontSize: '14px',
                                color: '#999',
                                marginTop: '8px'
                            }}>
                                Prova con un altro ID o clicca Reset
                            </p>
                        </div>
                    )}
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
