import React, { useState, useEffect } from 'react';
import PsychologistPatientTable from '../components/PsychologistPatientTable';
import PsychologistPatientDetailModal from '../components/PsychologistPatientDetailModal';
import type { PatientData, LoadingState } from '../types/patient';
import { fetchPatientsByPsychologist } from '../services/patient.service';
import { User, Eye, LayoutGrid, List } from 'lucide-react';
import '../css/QuestionnaireManagement.css'; // Reuse existing layout styles
import '../css/AdminPatientList.css'; // Reuse Admin styles for grid/list view

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
                // List view calculation
                const headerHeight = 80; // Navbar
                const titleSearchHeight = 140; // Title + Search bar
                const paginationHeight = 80; // Pagination controls
                const padding = 40; // Container padding

                const availableHeight = window.innerHeight - (headerHeight + titleSearchHeight + paginationHeight + padding);
                const rowHeight = 60; // Approximate height of a table row
                const tableHeaderHeight = 50;
                const listAvailableHeight = availableHeight - tableHeaderHeight;

                const rows = Math.max(5, Math.floor(listAvailableHeight / rowHeight));
                setItemsPerPage(rows);
            }
        };

        calculateItemsPerPage();
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

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="content-panel-flex">
            <h2 className="panel-title">I Miei Pazienti</h2>

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
                                    <>Trovati: {totalPatients} pazienti</>
                                ) : (
                                    <>Totale pazienti: {totalPatients}</>
                                )}
                                {totalPages > 1 && <> | Pagina {currentPage} di {totalPages}</>}
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
                                placeholder="🔍 Cerca per ID, nome o cognome..."
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
                                <button onClick={handleReset} className="clear-filter-btn">
                                    ↺ Reset
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

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '0',
                                    padding: '16px'
                                }}>
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        style={{
                                            padding: '8px 16px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            background: currentPage === 1 ? '#f5f5f5' : '#fff',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        ← Precedente
                                    </button>

                                    {getPageNumbers().map((page, index) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${index}`} style={{ padding: '0 8px' }}>...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => handlePageClick(page as number)}
                                                style={{
                                                    padding: '8px 12px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    background: currentPage === page ? '#0D475D' : '#fff',
                                                    color: currentPage === page ? '#fff' : '#333',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: currentPage === page ? 'bold' : 'normal'
                                                }}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}

                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            padding: '8px 16px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            background: currentPage === totalPages ? '#f5f5f5' : '#fff',
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Successiva →
                                    </button>
                                </div>
                            )}
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
                                margin: 0
                            }}>
                                🔍 Nessun paziente trovato con "<strong>{searchQuery}</strong>"
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
