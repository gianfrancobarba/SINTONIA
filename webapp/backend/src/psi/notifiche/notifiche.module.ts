import { Module } from '@nestjs/common';
import { NotificheController } from './notifiche.controller.js';
import { NotificheService } from './notifiche.service.js';
import { RolesGuard } from '../../auth/roles.guard.js';

@Module({
    controllers: [NotificheController],
    providers: [NotificheService, RolesGuard],
    exports: [NotificheService],
})
export class NotificheModule { }

