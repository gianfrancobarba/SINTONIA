import React, { useState, useEffect } from 'react';
import AdminPsychologistTable from '../components/AdminPsychologistTable';
import AdminPsychologistDetailModal from '../components/AdminPsychologistDetailModal';
import AddPsychologistModal from '../components/AddPsychologistModal';
import PageHeader from '../components/PageHeader';
import { User, UserCog, Eye, LayoutGrid, List, UserPlus, Search, RotateCcw } from 'lucide-react';
import '../css/QuestionnaireManagement.css'; // Reuse existing layout styles
import '../css/AdminPsychologistList.css';
import '../css/EmptyState.css';
import CompactPagination from '../components/CompactPagination';
import { fetchAllPsychologists, createPsychologist, type PsychologistOption } from '../services/psychologist.service';

interface PsychologistData {
    codiceFiscale: string;
    nome: string;
    cognome: string;
    email: string;
    aslAppartenenza: string;
    stato: 'Attivo' | 'Inattivo';  // Changed from 'Disattivato' to 'Inattivo'
}

// Helper function to normalize backend data to frontend format
const normalizePsychologist = (psy: PsychologistOption): PsychologistData => ({
    codiceFiscale: psy.codFiscale,
    nome: psy.nome,
    cognome: psy.cognome,
    email: psy.email || '',
    aslAppartenenza: psy.aslAppartenenza || '',
    stato: psy.stato === true ? 'Attivo' : 'Inattivo' // Convert boolean to string
});

const AdminPsychologistList: React.FC = () => {
    const [psychologists, setPsychologists] = useState<PsychologistData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewingPsychologist, setViewingPsychologist] = useState<PsychologistData | null>(null);
    const [selectedPsychologistId, setSelectedPsychologistId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [showAddModal, setShowAddModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'Attivo' | 'Inattivo'>('Attivo'); // Filter for active/inactive

    // Fetch psychologists from backend on mount
    useEffect(() => {
        const loadPsychologists = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchAllPsychologists();
                const normalized = data.map(normalizePsychologist);
                setPsychologists(normalized);
            } catch (err) {
                console.error('Error loading psychologists:', err);
                setError('Errore nel caricamento degli psicologi. Riprova più tardi.');
            } finally {
                setLoading(false);
            }
        };
        loadPsychologists();
    }, []);

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
    const [filteredPsychologists, setFilteredPsychologists] = useState<PsychologistData[]>([]);

    useEffect(() => {
        setFilteredPsychologists(psychologists);
    }, [psychologists]);

    // Effetto per filtrare psicologi in tempo reale
    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();

        // First filter by status (active/inactive)
        let statusFiltered = psychologists.filter(psy => psy.stato === statusFilter);

        if (!query) {
            // No search, show all psychologists with current status filter
            setFilteredPsychologists(statusFiltered);
        } else {
            // Filter by search query within the status-filtered list
            const filtered = statusFiltered.filter(psy =>
                psy.codiceFiscale.toLowerCase().includes(query) ||
                psy.nome.toLowerCase().includes(query) ||
                psy.cognome.toLowerCase().includes(query)
            );
            setFilteredPsychologists(filtered);
        }

        // Reset alla prima pagina quando cambia il filtro
        setCurrentPage(1);
    }, [searchQuery, psychologists, statusFilter]);

    const handleSelectPsychologist = (id: string) => {
        setSelectedPsychologistId(id);
    };

    const handleView = (id: string) => {
        const psychologist = psychologists.find(p => p.codiceFiscale === id);
        if (psychologist) {
            setViewingPsychologist(psychologist);
        }
    };

    const handleCloseModal = () => {
        setViewingPsychologist(null);
    };

    const handleOpenAddModal = () => {
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
    };

    const handleAddPsychologist = async (newPsychologist: PsychologistData) => {
        try {
            setLoading(true);
            setError(null);

            // Call backend API to create psychologist
            await createPsychologist({
                codFiscale: newPsychologist.codiceFiscale,
                nome: newPsychologist.nome,
                cognome: newPsychologist.cognome,
                email: newPsychologist.email || '',
                aslAppartenenza: newPsychologist.aslAppartenenza,
            });

            // Reload the psychologists list from backend
            const data = await fetchAllPsychologists();
            const normalized = data.map(normalizePsychologist);
            setPsychologists(normalized);

            // Modal closing is now handled by the modal itself after toast
            // setShowAddModal(false); 
        } catch (err: any) {
            console.error('Error adding psychologist:', err);
            // Re-throw error so the modal can handle it with a toast
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Gestione input ricerca (live)
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Reset ricerca
    const handleReset = () => {
        setSearchQuery('');
    };

    // Pagination logic sui psicologi filtrati
    const totalPsychologists = filteredPsychologists.length;
    const totalPages = Math.ceil(totalPsychologists / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPsychologists = filteredPsychologists.slice(startIndex, endIndex);

    return (
        <div className="content-panel">
            <PageHeader
                title="Gestione Psicologi"
                subtitle="Gestisci il team di psicologi della piattaforma"
                icon={<UserCog size={24} />}
            />

            {loading && (
                <div className="loading-state">Caricamento psicologi...</div>
            )}

            {error && !loading && (
                <div style={{
                    padding: '20px',
                    background: '#fee',
                    border: '1px solid #fcc',
                    borderRadius: '8px',
                    color: '#c00',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* Riga con informazioni e pulsante aggiungi */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                        gap: '16px'
                    }}>
                        <div className="filter-controls" style={{ margin: 0 }}>
                            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                                {searchQuery ? (
                                    <>Trovati: <strong style={{ color: '#0D475D' }}>{totalPsychologists}</strong> psicologi</>
                                ) : (
                                    <>Totale psicologi: <strong style={{ color: '#0D475D' }}>{totalPsychologists}</strong></>
                                )}
                            </p>
                        </div>

                        <button
                            onClick={handleOpenAddModal}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 18px',
                                background: '#0D475D',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(13, 71, 93, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 71, 93, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(13, 71, 93, 0.2)';
                            }}
                        >
                            <UserPlus size={18} />
                            Aggiungi Psicologo
                        </button>
                    </div>

                    {/* Barra di ricerca e controlli vista */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        marginBottom: '16px',
                        gap: '12px'
                    }}>
                        {/* Status Filter Toggle */}
                        <div style={{
                            display: 'flex',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            overflow: 'hidden'
                        }}>
                            <button
                                onClick={() => setStatusFilter('Attivo')}
                                style={{
                                    padding: '6px 12px',
                                    border: 'none',
                                    background: statusFilter === 'Attivo' ? '#7FB77E' : 'white',
                                    color: statusFilter === 'Attivo' ? 'white' : '#333',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: statusFilter === 'Attivo' ? '600' : '500',
                                    transition: 'all 0.2s ease',
                                    borderRight: '1px solid #ddd'
                                }}
                            >
                                ✓ Attivi
                            </button>
                            <button
                                onClick={() => setStatusFilter('Inattivo')}
                                style={{
                                    padding: '6px 12px',
                                    border: 'none',
                                    background: statusFilter === 'Inattivo' ? '#ef4444' : 'white',
                                    color: statusFilter === 'Inattivo' ? 'white' : '#333',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: statusFilter === 'Inattivo' ? '600' : '500',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                ✕ Inattivi
                            </button>
                        </div>

                        <div className="view-toggle">
                            <button
                                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                                title="Vista Griglia"
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                                title="Vista Lista"
                            >
                                <List size={16} />
                            </button>
                        </div>

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            placeholder="Cerca per CF, nome o cognome..."
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                fontSize: '13px',
                                width: '260px',
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

                    {/* Griglia psicologi o messaggio vuoto */}
                    {currentPsychologists.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="psychologist-grid">
                                    {currentPsychologists.map((psychologist) => (
                                        <div key={psychologist.codiceFiscale} className="psychologist-card">
                                            <div className="psychologist-avatar">
                                                <User size={32} />
                                            </div>
                                            <div className="psychologist-info">
                                                <h3 className="psychologist-name">{psychologist.nome} {psychologist.cognome}</h3>
                                                <p className="psychologist-specialization">{psychologist.aslAppartenenza}</p>
                                            </div>
                                            <button
                                                className="profile-btn"
                                                onClick={() => handleView(psychologist.codiceFiscale)}
                                            >
                                                <Eye size={16} />
                                                Profilo
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    <AdminPsychologistTable
                                        psychologists={currentPsychologists}
                                        selectedId={selectedPsychologistId}
                                        onSelect={handleSelectPsychologist}
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
                        <div className="unified-empty-state">
                            <div className="unified-empty-icon">
                                {searchQuery ? <Search size={48} /> : <UserCog size={48} />}
                            </div>
                            <h3 className="unified-empty-title">
                                {searchQuery ? 'Nessun Risultato' : 'Nessuno Psicologo'}
                            </h3>
                            <p className="unified-empty-message">
                                {searchQuery
                                    ? `Nessuno psicologo trovato con "${searchQuery}".`
                                    : 'Non sono presenti psicologi da visualizzare.'
                                }
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Modal for viewing psychologist details */}
            {viewingPsychologist && (
                <AdminPsychologistDetailModal
                    psychologist={viewingPsychologist}
                    onClose={handleCloseModal}
                    onUpdate={(updatedData) => {
                        // Update local state immediately if data is provided
                        if (updatedData && viewingPsychologist) {
                            // Normalize stato field: convert boolean to string if needed
                            let statoValue: 'Attivo' | 'Inattivo' = viewingPsychologist.stato;
                            if (typeof updatedData.stato === 'boolean') {
                                statoValue = updatedData.stato ? 'Attivo' : 'Inattivo';
                            } else if (updatedData.stato === 'Attivo' || updatedData.stato === 'Inattivo') {
                                statoValue = updatedData.stato;
                            }

                            setViewingPsychologist({
                                ...viewingPsychologist,
                                ...updatedData,
                                stato: statoValue
                            });
                        }

                        // Refresh the list
                        const loadPsychologists = async () => {
                            try {
                                // Don't show loading spinner for background refresh
                                // setLoading(true); 
                                const data = await fetchAllPsychologists();
                                const normalized = data.map(normalizePsychologist);
                                setPsychologists(normalized);
                            } catch (err) {
                                console.error('Error reloading psychologists:', err);
                            }
                        };
                        loadPsychologists();
                    }}
                />
            )}

            {/* Modal for adding new psychologist */}
            {showAddModal && (
                <AddPsychologistModal
                    onClose={handleCloseAddModal}
                    onAdd={handleAddPsychologist}
                />
            )}
        </div>
    );
};

export default AdminPsychologistList;
