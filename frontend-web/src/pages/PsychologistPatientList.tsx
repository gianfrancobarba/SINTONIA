import React, { useState, useEffect } from 'react';
import PsychologistPatientTable from '../components/PsychologistPatientTable';
import type { PatientData, LoadingState } from '../types/patient';
import { fetchPatientsByPsychologist } from '../services/patient.service';
import '../css/QuestionnaireManagement.css'; // Reuse existing layout styles

const ITEMS_PER_PAGE = 10;

const PsychologistPatientList: React.FC = () => {
    const [patientsState, setPatientsState] = useState<LoadingState<PatientData[]>>({
        data: null,
        loading: true,
        error: null,
    });
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        setPatientsState({ data: null, loading: true, error: null });
        try {
            const data = await fetchPatientsByPsychologist();
            setPatientsState({ data, loading: false, error: null });
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
        // Placeholder for future implementation
        alert(`Visualizza dettagli paziente: ${id.substring(0, 8)}...`);
    };

    // Pagination logic
    const totalPatients = patientsState.data?.length || 0;
    const totalPages = Math.ceil(totalPatients / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentPatients = patientsState.data?.slice(startIndex, endIndex) || [];

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
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) {
                pages.push('...');
            }
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="content-panel" style={{ height: '100%', boxSizing: 'border-box' }}>
            <h2 className="panel-title">I Miei Pazienti</h2>

            <div className="management-header">
                <div className="header-actions">
                    {/* Future: Add patient filters or actions here */}
                </div>
            </div>

            {patientsState.loading && (
                <div className="loading-state">Caricamento pazienti...</div>
            )}

            {patientsState.error && (
                <div className="error-state">
                    <p>Errore: {patientsState.error}</p>
                    <button onClick={() => window.location.reload()} className="retry-btn">
                        Riprova
                    </button>
                </div>
            )}

            {patientsState.data && !patientsState.loading && (
                <>
                    <div className="filter-controls">
                        <p style={{ color: '#666', fontSize: '14px' }}>
                            Totale pazienti: {totalPatients} {totalPages > 1 && `| Pagina ${currentPage} di ${totalPages} `}
                        </p>
                    </div>

                    <PsychologistPatientTable
                        patients={currentPatients}
                        selectedId={selectedPatientId}
                        onSelect={handleSelectPatient}
                        onView={handleView}
                    />

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '20px',
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
                                    <span key={`ellipsis - ${index} `} style={{ padding: '0 8px' }}>...</span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => handlePageClick(page as number)}
                                        style={{
                                            padding: '8px 12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            background: currentPage === page ? '#7FB77E' : '#fff',
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
            )}
        </div>
    );
};

export default PsychologistPatientList;
