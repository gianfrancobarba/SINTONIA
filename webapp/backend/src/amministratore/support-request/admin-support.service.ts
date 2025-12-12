import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { MailerService } from '../../mailer/mailer.service.js';

@Injectable()
export class AdminSupportService {
    constructor(
        @Inject('drizzle')
        private readonly db: NodePgDatabase<typeof schema>,
        private readonly mailerService: MailerService,
    ) { }

    async getAllTickets() {
        const tickets = await this.db.query.ticket.findMany({
            orderBy: (ticket, { desc }) => [desc(ticket.dataInvio)],
        });

        return tickets.map(ticket => ({
            idTicket: ticket.idTicket,
            stato: this.mapStatus(ticket.risolto),
            oggetto: ticket.oggetto,
            descrizione: ticket.descrizione,
            dataInvio: ticket.dataInvio,
            idPaziente: ticket.idPaziente,
            idPsicologo: ticket.idPsicologo,
        }));
    }

    private mapStatus(status: string | null): string {
        switch (status) {
            case 'Aperto': return 'aperto';
            case 'In elaborazione': return 'in-lavorazione';
            case 'Chiuso': return 'chiuso';
            default: return 'aperto';
        }
    }

    async replyToTicket(ticketId: string, response: string): Promise<void> {
        // Fetch ticket details
        const ticket = await this.db.query.ticket.findFirst({
            where: eq(schema.ticket.idTicket, ticketId),
        });

        if (!ticket) {
            throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
        }

        let userEmail: string | undefined;

        if (ticket.idPaziente) {
            const paziente = await this.db.query.paziente.findFirst({
                where: eq(schema.paziente.idPaziente, ticket.idPaziente),
            });
            userEmail = paziente?.email;
        } else if (ticket.idPsicologo) {
            const psicologo = await this.db.query.psicologo.findFirst({
                where: eq(schema.psicologo.codFiscale, ticket.idPsicologo),
            });
            userEmail = psicologo?.email;
        }

        // Override email for testing
        userEmail = 'gianlucaambrosio04@gmail.com';

        if (!userEmail) {
            throw new NotFoundException('User email not found for this ticket');
        }

        const subject = `Risposta al ticket #${ticketId}: ${ticket.oggetto}`;
        const text = `Gentile utente,\n\nIn merito alla tua richiesta di supporto (Ticket #${ticketId}), ecco la risposta del nostro team:\n\n${response}\n\nCordiali saluti,\nTeam di Supporto SINTONIA`;

        await this.mailerService.sendMail(userEmail, subject, text);

        // Update ticket status to 'Chiuso'
        await this.db.update(schema.ticket)
            .set({ risolto: 'Chiuso' })
            .where(eq(schema.ticket.idTicket, ticketId));
    }

    async closeTicket(ticketId: string): Promise<void> {
        const ticket = await this.db.query.ticket.findFirst({
            where: eq(schema.ticket.idTicket, ticketId),
        });

        if (!ticket) {
            throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
        }

        await this.db.update(schema.ticket)
            .set({ risolto: 'Chiuso' })
            .where(eq(schema.ticket.idTicket, ticketId));
    }
}
