import React, { useState, useEffect } from 'react';
import { Mail, Headphones } from 'lucide-react';
import TechnicalSupportDetailModal from '../components/TechnicalSupportDetailModal';
import PageHeader from '../components/PageHeader';
import type { TechnicalSupportTicket } from '../types/technicalSupport';
import '../css/AdminTechnicalSupport.css';
import '../css/QuestionnaireTable.css'; // Reuse table styles for consistency
import '../css/EmptyState.css';
import CompactPagination from '../components/CompactPagination';

// SVG Icon Component for View Button
const ViewIcon = () => (
    <svg viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="10.24">
        <path d="M112,44H48a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,112,44Zm-4,64H52V52h56ZM208,44H144a4,4,0,0,0-4,4v64a4,4,0,0,0,4,4h64a4,4,0,0,0,4-4V48A4,4,0,0,0,208,44Zm-4,64H148V52h56Zm-92,32H48a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,112,140Zm-4,64H52V148h56Zm100-64H144a4,4,0,0,0-4,4v64a4.0002,4.0002,0,0,0,4,4h64a4.0002,4.0002,0,0,0,4-4V144A4,4,0,0,0,208,140Zm-4,64H148V148h56Z" />
    </svg>
);

const AdminTechnicalSupport: React.FC = () => {
    const [tickets, setTickets] = useState<TechnicalSupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<TechnicalSupportTicket | null>(null);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
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

    const getPaginatedTickets = (): TechnicalSupportTicket[] => {
        const startIndex = (currentPage - 1) * TICKETS_PER_PAGE;
        const endIndex = startIndex + TICKETS_PER_PAGE;
        return tickets.slice(startIndex, endIndex);
    };

    const getTotalPages = (): number => {
        return Math.ceil(tickets.length / TICKETS_PER_PAGE);
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
            <div style={{ marginBottom: '16px' }}>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                    Totale ticket: <strong style={{ color: '#0D475D' }}>{tickets.length}</strong>
                </p>
            </div>

            {isLoading ? (
                <div className="support-loading-state" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <div className="support-loading-spinner" style={{ marginBottom: '16px', fontSize: '24px' }}>⏳</div>
                    <p>Caricamento ticket in corso...</p>
                </div>
            ) : tickets.length > 0 ? (
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
                    <h3 className="unified-empty-title">Nessun Ticket di Supporto</h3>
                    <p className="unified-empty-message">
                        Al momento non ci sono richieste di supporto tecnico da gestire.
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
