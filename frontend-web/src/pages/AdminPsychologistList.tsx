import React, { useState, useEffect } from 'react';
import AdminPsychologistTable from '../components/AdminPsychologistTable';
import AdminPsychologistDetailModal from '../components/AdminPsychologistDetailModal';
import AddPsychologistModal from '../components/AddPsychologistModal';
import { User, Eye, LayoutGrid, List, UserPlus, Search, RotateCcw } from 'lucide-react';
import '../css/QuestionnaireManagement.css'; // Reuse existing layout styles
import '../css/AdminPsychologistList.css';
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
            <h2 className="panel-title">Gestione Psicologi</h2>

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
                                    <>Trovati: {totalPsychologists} psicologi</>
                                ) : (
                                    <>Totale psicologi: {totalPsychologists}</>
                                )}
                                {totalPages > 1 && <> | Pagina {currentPage} di {totalPages}</>}
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
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <button
                                onClick={() => setStatusFilter('Attivo')}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    background: statusFilter === 'Attivo' ? '#7FB77E' : 'white',
                                    color: statusFilter === 'Attivo' ? 'white' : '#333',
                                    cursor: 'pointer',
                                    fontSize: '14px',
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
                                    padding: '8px 16px',
                                    border: 'none',
                                    background: statusFilter === 'Inattivo' ? '#ef4444' : 'white',
                                    color: statusFilter === 'Inattivo' ? 'white' : '#333',
                                    cursor: 'pointer',
                                    fontSize: '14px',
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
                            placeholder="Cerca per CF, nome o cognome..."
                            style={{
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: '2px solid #ddd',
                                fontSize: '14px',
                                width: '300px',
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
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}>
                                <Search size={18} style={{ flexShrink: 0 }} />
                                <span>Nessuno psicologo trovato con "<strong>{searchQuery}</strong>"</span>
                            </p>
                            <p style={{
                                fontSize: '14px',
                                color: '#999',
                                marginTop: '8px'
                            }}>
                                Prova con un altro termine o clicca Reset
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
                            setViewingPsychologist({
                                ...viewingPsychologist,
                                ...updatedData
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
