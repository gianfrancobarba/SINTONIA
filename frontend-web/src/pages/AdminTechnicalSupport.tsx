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
        descrizione: 'Gentile supporto,\n\nVorrei cambiare l\'indirizzo email associato al mio account da quello vecchio a quello nuovo.\n\nEmail attuale: vecchia@example.com\nNuova email: nuova@example.com\n\nCome posso procedere?',
        dataInvio: '2024-11-25T10:00:00Z',
        idPaziente: 'PAZ-892341',
        idPsicologo: null
    },
    {
        idTicket: 'TKT-2024-007',
        stato: 'aperto',
        oggetto: 'Badge non sbloccati nonostante obiettivi raggiunti',
        descrizione: 'Ciao team,\n\nHo completato 7 giorni consecutivi di attività ma il badge "Settimana Perfetta" non si è sbloccato.\n\nAnche per altri badge ho lo stesso problema. C\'è un ritardo nell\'assegnazione o è un bug?\n\nGrazie mille',
        dataInvio: '2024-12-02T19:15:00Z',
        idPaziente: 'PAZ-156789',
        idPsicologo: 'PSI-445566'
    },
    {
        idTicket: 'TKT-2024-008',
        stato: 'risolto',
        oggetto: 'Post nel forum non visibile',
        descrizione: 'Salve,\n\nHo pubblicato una domanda nel forum ieri sera ma non la vedo nell\'elenco delle discussioni.\n\nÈ stata forse bloccata dalla moderazione? Non ho ricevuto nessuna notifica in merito.\n\nPosso sapere cosa è successo?',
        dataInvio: '2024-11-30T20:40:00Z',
        idPaziente: 'PAZ-667788',
        idPsicologo: 'PSI-778899'
    },
    {
        idTicket: 'TKT-2024-009',
        stato: 'in-lavorazione',
        oggetto: 'App mobile non sincronizza i dati',
        descrizione: 'Buongiorno,\n\nI dati che inserisco dall\'app mobile (iOS) non vengono sincronizzati con la versione web.\n\nHo compilato questionari da cellulare ma quando accedo da computer non li vedo.\n\nC\'è un modo per forzare la sincronizzazione?\n\nGrazie',
        dataInvio: '2024-12-01T12:00:00Z',
        idPaziente: 'PAZ-334455',
        idPsicologo: 'PSI-556677'
    },
    {
        idTicket: 'TKT-2024-010',
        stato: 'aperto',
        oggetto: 'Grafici statistiche non leggibili su mobile',
        descrizione: 'Salve,\n\nI grafici nella sezione statistiche sono troppo piccoli su smartphone e non si riesce a leggere bene.\n\nSarebbe possibile renderli più grandi o permettere di ingrandirli con un tap?\n\nGrazie per l\'attenzione',
        dataInvio: '2024-12-02T15:20:00Z',
        idPaziente: 'PAZ-998877',
        idPsicologo: null
    },
    {
        idTicket: 'TKT-2024-011',
        stato: 'risolto',
        oggetto: 'Password dimenticata - reset non funzionante',
        descrizione: 'Gentili,\n\nHo dimenticato la password e ho provato a fare il reset tramite email ma il link che ricevo risulta scaduto anche se lo clicco subito.\n\nHo provato più volte senza successo.\n\nCome posso recuperare l\'accesso?',
        dataInvio: '2024-11-27T09:10:00Z',
        idPaziente: 'PAZ-112233',
        idPsicologo: 'PSI-998877'
    },
    {
        idTicket: 'TKT-2024-012',
        stato: 'chiuso',
        oggetto: 'Domanda su privacy e trattamento dati',
        descrizione: 'Buongiorno,\n\nVorrei sapere per quanto tempo vengono conservati i miei dati personali e i questionari compilati.\n\nInoltre, è possibile richiedere la cancellazione completa del mio account?\n\nGrazie per il chiarimento',
        dataInvio: '2024-11-26T14:30:00Z',
        idPaziente: 'PAZ-445566',
        idPsicologo: null
    }
];

const AdminTechnicalSupport: React.FC = () => {
    const [selectedTicket, setSelectedTicket] = useState<TechnicalSupportTicket | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'aperto': 'Aperto',
            'in-lavorazione': 'In Lavorazione',
            'risolto': 'Risolto',
            'chiuso': 'Chiuso'
        };
        return labels[status] || status;
    };

    const getStatusClass = (status: string) => {
        return `ticket-status-badge ticket-status-${status}`;
    };

    return (
        <div className="content-panel">
            <div className="support-page-header">
                <h1 className="support-page-title">Supporto Tecnico</h1>
                <p className="support-page-subtitle">
                    Gestisci le richieste di supporto tecnico inviate dai pazienti
                </p>
            </div>

            {MOCK_TICKETS.length > 0 ? (
                <div className="support-table-container">
                    <table className="support-table">
                        <thead>
                            <tr>
                                <th>ID Ticket</th>
                                <th>Stato</th>
                                <th>Oggetto</th>
                                <th>Data Invio</th>
                                <th>ID Paziente</th>
                                <th>ID Psicologo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_TICKETS.map((ticket) => (
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
                                    <td className="ticket-patient-cell">{ticket.idPaziente}</td>
                                    <td className={`ticket-psychologist-cell ${!ticket.idPsicologo ? 'no-psychologist' : ''}`}>
                                        {ticket.idPsicologo || 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
