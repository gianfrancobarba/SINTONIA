import { Module } from '@nestjs/common';
import { AdminSupportController } from './admin-support.controller.js';
import { AdminSupportService } from './admin-support.service.js';
import { MailerModule } from '../../mailer/mailer.module.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

@Module({
    imports: [MailerModule, DrizzleModule],
    controllers: [AdminSupportController],
    providers: [AdminSupportService],
})
export class AdminSupportModule { }
