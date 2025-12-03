import { Module } from '@nestjs/common';
import { PsiSupportController } from './psi-support.controller.js';
import { TicketModule } from '../../ticket/ticket.module.js';

@Module({
    imports: [TicketModule],
    controllers: [PsiSupportController],
})
export class PsiSupportModule { }
