import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service.js';
import { DrizzleModule } from '../drizzle/drizzle.module.js';

@Module({
    imports: [DrizzleModule],
    providers: [TicketService],
    exports: [TicketService],
})
export class TicketModule { }
