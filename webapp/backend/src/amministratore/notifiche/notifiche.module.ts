import { Module } from '@nestjs/common';
import { AdminNotificheController } from './notifiche.controller.js';
import { AdminNotificheService } from './notifiche.service.js';
import { RolesGuard } from '../../auth/roles.guard.js';

@Module({
    controllers: [AdminNotificheController],
    providers: [AdminNotificheService, RolesGuard],
    exports: [AdminNotificheService],
})
export class AdminNotificheModule { }

