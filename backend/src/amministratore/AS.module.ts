import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard/dashboard.service.js';
import { AdminForumModule } from './forum/admin-forum.module.js';
import { DashboardController } from './dashboard/dashboard.controller.js';

@Module({
    imports: [AdminForumModule],
    controllers: [DashboardController],
    providers: [DashboardService],
    exports: [DashboardService], // Exporting so DashboardModule can use it
})
export class ASModule { }
