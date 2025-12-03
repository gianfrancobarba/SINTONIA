import { Injectable } from '@nestjs/common';
import { db } from '../drizzle/db.js';
import { ticket } from '../drizzle/schema.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';

@Injectable()
export class TicketService {
    /**
     * Crea un nuovo ticket di supporto
     */
    async createTicket(data: CreateTicketDto): Promise<{ success: boolean; message: string }> {
        try {
            await db.insert(ticket).values({
                oggetto: data.oggetto,
                descrizione: data.descrizione,
                risolto: 'Aperto',
                idPaziente: data.idPaziente || null,
                idPsicologo: data.idPsicologo || null,
                idAmministratore: data.idAmministratore || null,
            });

            return {
                success: true,
                message: 'Richiesta di supporto inviata con successo',
            };
        } catch (error) {
            console.error('Errore creazione ticket:', error);
            throw new Error('Errore durante la creazione del ticket');
        }
    }
}
