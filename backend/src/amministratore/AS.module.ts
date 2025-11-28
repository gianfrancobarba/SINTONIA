import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard/dashboard.service.js';
import { DashboardController } from './dashboard/dashboard.controller.js';

@Module({
    controllers: [DashboardController],
    providers: [DashboardService],
    exports: [DashboardService], // Exporting so DashboardModule can use it
})
export class ASModule { }
