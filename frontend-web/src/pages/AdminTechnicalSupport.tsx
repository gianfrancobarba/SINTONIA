import React, { useState } from 'react';
import TechnicalSupportDetailModal from '../components/TechnicalSupportDetailModal';
import type { TechnicalSupportTicket } from '../types/technicalSupport';
import '../css/AdminTechnicalSupport.css';

// Mock data for technical support tickets
const MOCK_TICKETS: TechnicalSupportTicket[] = [
    {
        idTicket: 'TKT-2024-001',
        stato: 'aperto',
        oggetto: 'Impossibile accedere alla sezione questionari',
        descrizione: 'Buongiorno,\n\nDa ieri mattina non riesco più ad accedere alla sezione dei questionari. Ogni volta che provo a cliccare sul menu, la pagina si blocca e devo ricaricare tutto il browser.\n\nHo provato con Chrome e Firefox ma il problema persiste.\n\nGrazie per il supporto.',
        dataInvio: '2024-12-01T09:30:00Z',
        idPaziente: 'PAZ-589472',
        idPsicologo: 'PSI-104523'
    },
    {
        idTicket: 'TKT-2024-002',
        stato: 'in-lavorazione',
        oggetto: 'Errore durante il salvataggio del diario personale',
        descrizione: 'Ciao,\n\nQuando provo a salvare le mie note nel diario personale ottengo un messaggio di errore: "Impossibile salvare i dati. Riprova più tardi".\n\nIl problema si verifica solo quando scrivo testi lunghi (oltre 500 caratteri circa).\n\nPuò essere un limite del sistema?',
        dataInvio: '2024-12-01T14:15:00Z',
        idPaziente: 'PAZ-623891',
        idPsicologo: null
    },
    {
        idTicket: 'TKT-2024-003',
        stato: 'risolto',
        oggetto: 'Non ricevo le notifiche email',
        descrizione: 'Gentili,\n\nNon ricevo più le notifiche via email relative ai nuovi messaggi del forum o agli aggiornamenti del mio psicologo.\n\nHo controllato la cartella spam ma non c\'è nulla. L\'indirizzo email nel mio profilo è corretto.\n\nCordiali saluti',
        dataInvio: '2024-11-28T11:20:00Z',
        idPaziente: 'PAZ-745123',
        idPsicologo: 'PSI-892341'
    },
    {
        idTicket: 'TKT-2024-004',
        stato: 'aperto',
        oggetto: 'Problema con l\'autenticazione SPID',
        descrizione: 'Salve,\n\nOggi ho provato ad accedere con SPID ma dopo l\'autenticazione vengo reindirizzato a una pagina bianca.\n\nHo usato il provider PosteID. Con altri servizi SPID funziona correttamente.\n\nPotete verificare?',
        dataInvio: '2024-12-02T08:45:00Z',
        idPaziente: 'PAZ-301948',
        idPsicologo: 'PSI-567234'
    },
    {
        idTicket: 'TKT-2024-005',
        stato: 'in-lavorazione',
        oggetto: 'Calendario attività non si aggiorna',
        descrizione: 'Buonasera,\n\nIl calendario nella homepage non riflette le attività che ho completato oggi. Ho compilato un questionario stamattina ma il giorno di oggi risulta ancora vuoto.\n\nHo provato a fare logout e login ma niente da fare.\n\nGrazie',
        dataInvio: '2024-12-02T16:30:00Z',
        idPaziente: 'PAZ-478912',
        idPsicologo: 'PSI-234567'
    },
    {
        idTicket: 'TKT-2024-006',
        stato: 'chiuso',
        oggetto: 'Richiesta modifica email personale',
        descrizione: 'Vorrei cambiare l\'indirizzo email associato al mio account ma non trovo l\'opzione nelle impostazioni. Potete farlo voi manualmente? La nuova email è mario.rossi.new@email.com',
        dataInvio: '2024-11-25T10:00:00Z',
        idPaziente: 'PAZ-892341',
        idPsicologo: null
    },
    {
        idTicket: 'TKT-2024-007',
        stato: 'aperto',
        oggetto: 'App mobile crasha all\'avvio',
        descrizione: 'Ho installato l\'app sul mio iPhone 12 ma crasha subito dopo il logo iniziale. Ho provato a reinstallarla ma il problema persiste. Versione iOS 17.1.',
        dataInvio: '2024-12-03T09:15:00Z',
        idPaziente: 'PAZ-112233',
        idPsicologo: 'PSI-445566'
    },
    {
        idTicket: 'TKT-2024-008',
        stato: 'in-lavorazione',
        oggetto: 'Domanda su privacy dati',
        descrizione: 'Vorrei sapere per quanto tempo vengono conservati i dati dei miei questionari dopo la fine del percorso terapeutico. Non trovo questa informazione nella policy.',
        dataInvio: '2024-12-03T11:00:00Z',
        idPaziente: 'PAZ-998877',
        idPsicologo: 'PSI-104523'
    },
    {
        idTicket: 'TKT-2024-009',
        stato: 'risolto',
        oggetto: 'Errore visualizzazione grafici',
        descrizione: 'I grafici dell\'andamento umore non vengono visualizzati correttamente su iPad. Le barre sono sovrapposte.',
        dataInvio: '2024-11-30T15:45:00Z',
        idPaziente: 'PAZ-554433',
        idPsicologo: 'PSI-892341'
    },
    {
        idTicket: 'TKT-2024-010',
        stato: 'aperto',
        oggetto: 'Manca opzione videochiamata',
        descrizione: 'Dovrei avere una seduta online oggi ma non vedo il pulsante per avviare la videochiamata nella dashboard.',
        dataInvio: '2024-12-03T14:20:00Z',
        idPaziente: 'PAZ-667788',
        idPsicologo: 'PSI-567234'
    },
    {
        idTicket: 'TKT-2024-011',
        stato: 'chiuso',
        oggetto: 'Account bloccato',
        descrizione: 'Ho sbagliato password troppe volte e ora il mio account è bloccato. Come posso sbloccarlo?',
        dataInvio: '2024-11-20T08:00:00Z',
        idPaziente: 'PAZ-223344',
        idPsicologo: null
    },
    {
        idTicket: 'TKT-2024-012',
        stato: 'in-lavorazione',
        oggetto: 'Suggerimento nuova funzionalità',
        descrizione: 'Sarebbe utile poter esportare i propri diari in formato PDF per poterli stampare. È previsto in futuro?',
        dataInvio: '2024-12-02T18:00:00Z',
        idPaziente: 'PAZ-778899',
        idPsicologo: 'PSI-234567'
    }
];

const AdminTechnicalSupport: React.FC = () => {
    const [selectedTicket, setSelectedTicket] = useState<TechnicalSupportTicket | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const TICKETS_PER_PAGE = 10;

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
        return MOCK_TICKETS.slice(startIndex, endIndex);
    };

    const getTotalPages = (): number => {
        return Math.ceil(MOCK_TICKETS.length / TICKETS_PER_PAGE);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const openTicketsCount = MOCK_TICKETS.filter(t => t.stato === 'aperto').length;

    return (
        <div className="content-panel">
            <div className="support-page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h1 className="support-page-title" style={{ margin: 0 }}>Supporto Tecnico</h1>
                    {openTicketsCount > 0 && (
                        <span style={{
                            background: '#FFF3E0',
                            color: '#E65100',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            border: '1px solid #FFB74D',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#EF6C00',
                                display: 'inline-block'
                            }}></span>
                            {openTicketsCount} aperti
                        </span>
                    )}
                </div>
                <p className="support-page-subtitle">
                    Gestisci le richieste di supporto tecnico inviate dai pazienti
                </p>
            </div>

            {MOCK_TICKETS.length > 0 ? (
                <>
                    <div className="support-table-container">
                        <table className="support-table">
                            <thead>
                                <tr>
                                    <th>ID Ticket</th>
                                    <th>Stato</th>
                                    <th>Oggetto</th>
                                    <th>Data Invio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getPaginatedTickets().map((ticket) => (
                                    <tr
                                        key={ticket.idTicket}
                                        onClick={() => setSelectedTicket(ticket)}
                                    >
                                        <td className="ticket-id-cell">{ticket.idTicket}</td>
                                        <td>
                                            <span className={getStatusClass(ticket.stato)}>
                                                {getStatusLabel(ticket.stato)}
                                            </span>
                                        </td>
                                        <td className="ticket-object-cell">{ticket.oggetto}</td>
                                        <td className="ticket-date-cell">{formatDate(ticket.dataInvio)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {getTotalPages() > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-button"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                ← Precedente
                            </button>
                            <div className="pagination-info">
                                Pagina {currentPage} di {getTotalPages()}
                            </div>
                            <button
                                className="pagination-button"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === getTotalPages()}
                            >
                                Successiva →
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="support-empty-state">
                    <div className="support-empty-icon">📧</div>
                    <h3 className="support-empty-title">Nessun Ticket di Supporto</h3>
                    <p className="support-empty-message">
                        Al momento non ci sono richieste di supporto tecnico.
                    </p>
                </div>
            )}

            {selectedTicket && (
                <TechnicalSupportDetailModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                />
            )}
        </div>
    );
};

export default AdminTechnicalSupport;
