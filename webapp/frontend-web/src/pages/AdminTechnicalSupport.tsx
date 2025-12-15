import React, { useState, useEffect } from 'react';
import { Mail, Headphones } from 'lucide-react';
import TechnicalSupportDetailModal from '../components/TechnicalSupportDetailModal';
import PageHeader from '../components/PageHeader';
import type { TechnicalSupportTicket } from '../types/technicalSupport';
import '../css/AdminTechnicalSupport.css';
import '../css/ForumPage.css'; // Reuse filter-pill styles
import '../css/QuestionnaireTable.css'; // Reuse table styles for consistency
import '../css/EmptyState.css';
import CompactPagination from '../components/CompactPagination';

// SVG Icon Component for View Button
const ViewIcon = () => (
    <svg viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="10.24">
        <path d="M112,44H48a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,112,44Zm-4,64H52V52h56ZM208,44H144a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,208,44Zm-4,64H148V52h56Zm-92,32H48a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,112,140Zm-4,64H52V148h56Zm100-64H144a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,208,140Zm-4,64H148V148h56Z" />
    </svg>
);

type StatusFilter = 'all' | 'open' | 'closed';

const AdminTechnicalSupport: React.FC = () => {
    const [tickets, setTickets] = useState<TechnicalSupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<TechnicalSupportTicket | null>(null);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const TICKETS_PER_PAGE = 4;

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const token = user?.access_token;

            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await fetch('http://localhost:3000/admin/support-request', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'aperto': return 'Aperto';
            case 'in-lavorazione': return 'In Lavorazione';
            case 'risolto': return 'Risolto';
            case 'chiuso': return 'Chiuso';
            default: return status;
        }
    };

    const getStatusClass = (status: string) => {
        return `ticket-status-badge ticket-status-${status}`;
    };

    // Filter tickets based on status filter
    const getFilteredTickets = (): TechnicalSupportTicket[] => {
        switch (statusFilter) {
            case 'open':
                return tickets.filter(t => t.stato === 'aperto' || t.stato === 'in-lavorazione');
            case 'closed':
                return tickets.filter(t => t.stato === 'risolto' || t.stato === 'chiuso');
            case 'all':
            default:
                return tickets;
        }
    };

    // Get ticket counts for filter badges
    const getStats = () => {
        const openCount = tickets.filter(t => t.stato === 'aperto' || t.stato === 'in-lavorazione').length;
        const closedCount = tickets.filter(t => t.stato === 'risolto' || t.stato === 'chiuso').length;
        return { total: tickets.length, open: openCount, closed: closedCount };
    };

    const getPaginatedTickets = (): TechnicalSupportTicket[] => {
        const filtered = getFilteredTickets();
        const startIndex = (currentPage - 1) * TICKETS_PER_PAGE;
        const endIndex = startIndex + TICKETS_PER_PAGE;
        return filtered.slice(startIndex, endIndex);
    };

    const getTotalPages = (): number => {
        return Math.ceil(getFilteredTickets().length / TICKETS_PER_PAGE);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="content-panel">
            <PageHeader
                title="Supporto Tecnico"
                subtitle="Gestisci le richieste di supporto tecnico"
                icon={<Headphones size={24} />}
            />
            {/* Filter Pills */}
            <div className="forum-filters" style={{ marginBottom: '16px' }}>
                <button
                    className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
                >
                    Tutti ({getStats().total})
                </button>
                <button
                    className={`filter-pill filter-open ${statusFilter === 'open' ? 'active' : ''}`}
                    onClick={() => { setStatusFilter('open'); setCurrentPage(1); }}
                >
                    Aperti ({getStats().open})
                </button>
                <button
                    className={`filter-pill filter-closed ${statusFilter === 'closed' ? 'active' : ''}`}
                    onClick={() => { setStatusFilter('closed'); setCurrentPage(1); }}
                >
                    Chiusi ({getStats().closed})
                </button>
            </div>

            {isLoading ? (
                <div className="support-loading-state" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <div className="support-loading-spinner" style={{ marginBottom: '16px', fontSize: '24px' }}>⏳</div>
                    <p>Caricamento ticket in corso...</p>
                </div>
            ) : getFilteredTickets().length > 0 ? (
                <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                    <div className="support-table-container">
                        <table className="support-table">
                            <thead>
                                <tr>
                                    <th>ID Ticket</th>
                                    <th>Stato</th>
                                    <th>Oggetto</th>
                                    <th>Data Invio</th>
                                    <th>Azioni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getPaginatedTickets().map((ticket) => {
                                    const isSelected = selectedTicketId === ticket.idTicket;
                                    return (
                                        <tr
                                            key={ticket.idTicket}
                                            className={isSelected ? 'selected' : ''}
                                            onClick={() => setSelectedTicketId(ticket.idTicket)}
                                        >
                                            <td className="ticket-id-cell">{ticket.idTicket}</td>
                                            <td>
                                                <span className={getStatusClass(ticket.stato)}>
                                                    {getStatusLabel(ticket.stato)}
                                                </span>
                                            </td>
                                            <td className="ticket-object-cell">{ticket.oggetto}</td>
                                            <td className="ticket-date-cell">{formatDate(ticket.dataInvio)}</td>
                                            <td className="actions-cell">
                                                <button
                                                    className="action-btn view-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedTicket(ticket);
                                                    }}
                                                    aria-label="Visualizza"
                                                    title="Visualizza dettagli"
                                                >
                                                    <ViewIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="unified-empty-state">
                    <div className="unified-empty-icon">
                        <Mail size={48} />
                    </div>
                    <h3 className="unified-empty-title">
                        {statusFilter === 'all' ? 'Nessun Ticket' :
                            statusFilter === 'open' ? 'Nessun Ticket Aperto' :
                                'Nessun Ticket Chiuso'}
                    </h3>
                    <p className="unified-empty-message">
                        {statusFilter === 'all'
                            ? 'Al momento non ci sono richieste di supporto tecnico da gestire.'
                            : statusFilter === 'open'
                                ? 'Non ci sono ticket aperti al momento.'
                                : 'Non ci sono ticket chiusi al momento.'}
                    </p>
                </div>
            )}

            {/* Fixed Pagination Footer */}
            <CompactPagination
                currentPage={currentPage}
                totalPages={getTotalPages()}
                onPageChange={handlePageChange}
            />

            {selectedTicket && (
                <TechnicalSupportDetailModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    onTicketUpdated={fetchTickets}
                />
            )}
        </div>
    );
};

export default AdminTechnicalSupport;
