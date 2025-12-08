export type TicketStatus = 'aperto' | 'in-lavorazione' | 'risolto' | 'chiuso';

export interface TechnicalSupportTicket {
    idTicket: string;
    stato: TicketStatus;
    oggetto: string;
    descrizione: string;
    dataInvio: string; // ISO date format
    idPaziente: string;
    idPsicologo: string | null;
}
