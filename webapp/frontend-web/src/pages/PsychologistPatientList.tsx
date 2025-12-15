import React, { useState, useEffect } from 'react';
import PsychologistPatientTable from '../components/PsychologistPatientTable';
import PsychologistPatientDetailModal from '../components/PsychologistPatientDetailModal';
import PageHeader from '../components/PageHeader';
import type { PatientData, LoadingState } from '../types/patient';
import { fetchPatientsByPsychologist } from '../services/patient.service';
import { Users, User, Eye, LayoutGrid, List, Search, RotateCcw } from 'lucide-react';
import '../css/QuestionnaireManagement.css'; // Reuse existing layout styles
import '../css/AdminPatientList.css'; // Reuse Admin styles for grid/list view
import CompactPagination from '../components/CompactPagination';

const PsychologistPatientList: React.FC = () => {
    const [patientsState, setPatientsState] = useState<LoadingState<PatientData[]>>({
        data: null,
        loading: true,
        error: null,
    });
    const [viewingPatient, setViewingPatient] = useState<PatientData | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    // Calcolo dinamico degli elementi per pagina
    useEffect(() => {
        const calculateItemsPerPage = () => {
            if (viewMode === 'grid') {
                setItemsPerPage(8);
            } else {
                // List view: fixed 4 rows
                setItemsPerPage(4);
            }
        };

        calculateItemsPerPage();
        setCurrentPage(1); // Reset pagination when view mode changes
        window.addEventListener('resize', calculateItemsPerPage);

        return () => window.removeEventListener('resize', calculateItemsPerPage);
    }, [viewMode]);

    // Stati per la ricerca live
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredPatients, setFilteredPatients] = useState<PatientData[]>([]);

    useEffect(() => {
        loadPatients();
    }, []);

    // Effetto per filtrare pazienti in tempo reale
    useEffect(() => {
        if (!patientsState.data) return;

        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            // Nessuna ricerca, mostra tutti
            setFilteredPatients(patientsState.data);
        } else {
            // Filtra per ID, nome o cognome (case insensitive)
            const filtered = patientsState.data.filter(patient =>
                patient.idPaziente.toLowerCase().includes(query) ||
                patient.nome.toLowerCase().includes(query) ||
                patient.cognome.toLowerCase().includes(query)
            );
            setFilteredPatients(filtered);
        }

        // Reset alla prima pagina quando cambia il filtro
        setCurrentPage(1);
    }, [searchQuery, patientsState.data]);

    const loadPatients = async () => {
        setPatientsState({ data: null, loading: true, error: null });
        try {
            const data = await fetchPatientsByPsychologist();
            setPatientsState({ data, loading: false, error: null });
            setFilteredPatients(data);
            setCurrentPage(1);
        } catch (error) {
            setPatientsState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to load patients',
            });
        }
    };


    const handleSelectPatient = (id: string) => {
        setSelectedPatientId(id);
    };

    const handleView = (id: string) => {
        const patient = patientsState.data?.find(p => p.idPaziente === id);
        if (patient) {
            setViewingPatient(patient);
        }
    };

    const handleCloseModal = () => {
        setViewingPatient(null);
    };

    // Gestione input ricerca (live)
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Reset ricerca
    const handleReset = () => {
        setSearchQuery('');
    };

    // Pagination logic sui pazienti filtrati
    const totalPatients = filteredPatients.length;
    const totalPages = Math.ceil(totalPatients / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPatients = filteredPatients.slice(startIndex, endIndex);

    return (
        <div className="content-panel">
            <PageHeader
                title="I Miei Pazienti"
                subtitle="I pazienti assegnati a te"
                icon={<Users size={24} />}
            />

            {patientsState.loading && (
                <div className="loading-state">Caricamento pazienti...</div>
            )}

            {patientsState.error && (
                <div className="error-state">
                    <p>Errore: {patientsState.error}</p>
                    <button onClick={() => loadPatients()} className="retry-btn">
                        Riprova
                    </button>
                </div>
            )}

            {patientsState.data && !patientsState.loading && (
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
                                    <>Trovati: <strong style={{ color: '#0D475D' }}>{totalPatients}</strong> pazienti</>
                                ) : (
                                    <>Totale pazienti: <strong style={{ color: '#0D475D' }}>{totalPatients}</strong></>
                                )}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div className="view-toggle">
                                <button
                                    className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                    title="Vista Griglia"
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                    title="Vista Lista"
                                >
                                    <List size={18} />
                                </button>
                            </div>

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                placeholder="Cerca per ID, nome o cognome..."
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
                                <button onClick={handleReset} className="clear-filter-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <RotateCcw size={14} />
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Griglia pazienti o messaggio vuoto */}
                    {currentPatients.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="patient-grid">
                                    {currentPatients.map((patient) => (
                                        <div key={patient.idPaziente} className="patient-card">
                                            <div className="patient-avatar">
                                                <User size={32} />
                                            </div>
                                            <div className="patient-info">
                                                <h3 className="patient-name">{patient.nome} {patient.cognome}</h3>
                                            </div>
                                            <button
                                                className="profile-btn"
                                                onClick={() => handleView(patient.idPaziente)}
                                            >
                                                <Eye size={16} />
                                                Profilo
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    <PsychologistPatientTable
                                        patients={currentPatients}
                                        selectedId={selectedPatientId}
                                        onSelect={handleSelectPatient}
                                        onView={handleView}
                                    />
                                </div>
                            )}

                            {/* Compact Pagination */}
                            <CompactPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
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
                                <span>Nessun paziente trovato con "<strong>{searchQuery}</strong>"</span>
                            </p>
                            <p style={{
                                fontSize: '14px',
                                color: '#999',
                                marginTop: '8px'
                            }}>
                                Prova con un altro nome o cognome, oppure clicca Reset
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Modal for viewing patient details */}
            {viewingPatient && (
                <PsychologistPatientDetailModal
                    patient={viewingPatient}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default PsychologistPatientList;
