import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AdminSupportService } from './admin-support.service.js';
import { AdminSupportReplyDto } from './dto/admin-support-reply.dto.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/support-request')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminSupportController {
    constructor(private readonly adminSupportService: AdminSupportService) { }

    @Post('reply')
    @Roles('admin')
    async replyToTicket(@Body() replyDto: AdminSupportReplyDto) {
        const { ticketId, response } = replyDto;
        await this.adminSupportService.replyToTicket(ticketId, response);
        return { message: 'Risposta inviata con successo' };
    }

    @Post('close')
    @Roles('admin')
    async closeTicket(@Body('ticketId') ticketId: string) {
        await this.adminSupportService.closeTicket(ticketId);
        return { message: 'Ticket chiuso con successo' };
    }

    @Get()
    @Roles('admin')
    async findAll() {
        return this.adminSupportService.getAllTickets();
    }
}
