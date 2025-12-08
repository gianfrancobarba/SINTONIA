import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller.js';
import { SettingsService } from './settings.service.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';
import { TicketModule } from '../../ticket/ticket.module.js';

@Module({
    imports: [DrizzleModule, TicketModule],
    controllers: [SettingsController],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule { }
