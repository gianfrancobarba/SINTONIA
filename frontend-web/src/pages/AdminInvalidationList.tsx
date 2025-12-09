import React, { useState, useEffect } from 'react';
import { FileX } from 'lucide-react';
import AdminInvalidationTable from '../components/AdminInvalidationTable';
import AdminInvalidationDetailModal from '../components/AdminInvalidationDetailModal';
import PageHeader from '../components/PageHeader';
import type { InvalidationRequestData, InvalidationLoadingState } from '../types/invalidation';
import { fetchInvalidationRequests, acceptInvalidationRequest, rejectInvalidationRequest } from '../services/invalidation.service';
import '../css/QuestionnaireManagement.css';
import '../css/EmptyState.css';

import Toast from '../components/Toast';

const AdminInvalidationList: React.FC = () => {
    const [requestsState, setRequestsState] = useState<InvalidationLoadingState<InvalidationRequestData[]>>({
        data: null,
        loading: true,
        error: null,
    });
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [viewingRequest, setViewingRequest] = useState<InvalidationRequestData | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setRequestsState({ data: null, loading: true, error: null });
        try {
            const data = await fetchInvalidationRequests();
            setRequestsState({ data, loading: false, error: null });
        } catch (error) {
            setRequestsState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to load invalidation requests',
            });
        }
    };

    const handleSelectRequest = (id: string) => {
        setSelectedRequestId(id);
    };

    const handleView = (id: string) => {
        const request = requestsState.data?.find(r => r.idRichiesta === id);
        if (request) {
            setViewingRequest(request);
        }
    };

    const handleCloseModal = () => {
        setViewingRequest(null);
    };

    const handleAccept = async (id: string) => {
        try {
            await acceptInvalidationRequest(id);
            // Reload requests after accepting
            await loadRequests();
            // Close modal if open
            if (viewingRequest?.idRichiesta === id) {
                setViewingRequest(null);
            }
            setToast({ message: 'Richiesta accettata con successo!', type: 'success' });
        } catch (error) {
            console.error('Error accepting invalidation request:', error);
            setToast({ message: 'Errore durante l\'accettazione della richiesta. Riprova.', type: 'error' });
        }
    };


    const handleReject = async (id: string) => {
        try {
            await rejectInvalidationRequest(id);
            // Reload requests after rejecting
            await loadRequests();
            // Close modal if open
            if (viewingRequest?.idRichiesta === id) {
                setViewingRequest(null);
            }
            setToast({ message: 'Richiesta rifiutata con successo!', type: 'success' });
        } catch (error) {
            console.error('Error rejecting invalidation request:', error);
            setToast({ message: 'Errore durante il rifiuto della richiesta. Riprova.', type: 'error' });
        }
    };


    const handleFilterChange = (filter: 'all' | 'pending' | 'approved' | 'rejected') => {
        setStatusFilter(filter);
        setSelectedRequestId(null);
    };

    // Filtra le richieste in base allo stato
    const filteredRequests = requestsState.data?.filter(req => {
        if (statusFilter === 'all') return true;
        return req.stato === statusFilter;
    }) || [];

    return (
        <div className="content-panel" style={{ height: '100%', boxSizing: 'border-box' }}>
            <PageHeader
                title="Richieste di Invalidazione"
                subtitle="Gestisci le richieste di invalidazione"
                icon={<FileX size={24} />}
            />

            {requestsState.loading && (
                <div className="loading-state">Caricamento richieste...</div>
            )}

            {requestsState.error && (
                <div className="error-state">
                    <p>Errore: {requestsState.error}</p>
                    <button onClick={loadRequests} className="retry-btn">
                        Riprova
                    </button>
                </div>
            )}

            {requestsState.data && !requestsState.loading && (
                <>
                    {/* Filter Controls */}
                    <div className="filter-controls" style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', color: '#333' }}>Filtra per stato:</span>
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={statusFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: statusFilter === 'all' ? '2px solid #0D475D' : '2px solid #ddd',
                                    background: statusFilter === 'all' ? '#0D475D' : '#fff',
                                    color: statusFilter === 'all' ? '#fff' : '#333',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: statusFilter === 'all' ? 'bold' : 'normal',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Tutte ({requestsState.data.length})
                            </button>
                            <button
                                onClick={() => handleFilterChange('pending')}
                                className={statusFilter === 'pending' ? 'filter-btn active' : 'filter-btn'}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: statusFilter === 'pending' ? '2px solid #FFA726' : '2px solid #ddd',
                                    background: statusFilter === 'pending' ? '#FFA726' : '#fff',
                                    color: statusFilter === 'pending' ? '#fff' : '#333',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: statusFilter === 'pending' ? 'bold' : 'normal',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                In Attesa ({requestsState.data.filter(r => r.stato === 'pending').length})
                            </button>
                            <button
                                onClick={() => handleFilterChange('approved')}
                                className={statusFilter === 'approved' ? 'filter-btn active' : 'filter-btn'}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: statusFilter === 'approved' ? '2px solid #7FB77E' : '2px solid #ddd',
                                    background: statusFilter === 'approved' ? '#7FB77E' : '#fff',
                                    color: statusFilter === 'approved' ? '#fff' : '#333',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: statusFilter === 'approved' ? 'bold' : 'normal',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Approvate ({requestsState.data.filter(r => r.stato === 'approved').length})
                            </button>
                            <button
                                onClick={() => handleFilterChange('rejected')}
                                className={statusFilter === 'rejected' ? 'filter-btn active' : 'filter-btn'}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: statusFilter === 'rejected' ? '2px solid #E57373' : '2px solid #ddd',
                                    background: statusFilter === 'rejected' ? '#E57373' : '#fff',
                                    color: statusFilter === 'rejected' ? '#fff' : '#333',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: statusFilter === 'rejected' ? 'bold' : 'normal',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Rifiutate ({requestsState.data.filter(r => r.stato === 'rejected').length})
                            </button>
                        </div>
                    </div>

                    {/* Table or Empty State */}
                    {filteredRequests.length > 0 ? (
                        <AdminInvalidationTable
                            requests={filteredRequests}
                            selectedId={selectedRequestId}
                            onSelect={handleSelectRequest}
                            onView={handleView}
                        />
                    ) : (
                        <div className="unified-empty-state">
                            <div className="unified-empty-icon">
                                <FileX size={48} />
                            </div>
                            <h3 className="unified-empty-title">Nessuna Richiesta</h3>
                            <p className="unified-empty-message">
                                Non ci sono richieste di invalidazione per il filtro selezionato.
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Modal for viewing request details */}
            {viewingRequest && (
                <AdminInvalidationDetailModal
                    request={viewingRequest}
                    onClose={handleCloseModal}
                    onAccept={handleAccept}
                    onReject={handleReject}
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

export default AdminInvalidationList;
