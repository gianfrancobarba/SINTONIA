import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';
import { RolesGuard } from '../../auth/roles.guard.js';

@Module({
    controllers: [DashboardController],
    providers: [DashboardService, RolesGuard],
    exports: [DashboardService],
})
export class DashboardModule { }