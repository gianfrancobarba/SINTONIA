import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard/dashboard.service.js';

@Module({
    providers: [DashboardService],
    exports: [DashboardService], // Exporting so DashboardModule can use it
})
export class ASModule { }
