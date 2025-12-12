import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller.js';
import { ASModule } from '../amministratore/AS.module.js';
import { DashboardModule as PsiDashboardModule } from '../psi/dashboard/dashboard.module.js';

@Module({
    imports: [ASModule, PsiDashboardModule], // Import Admin + Psychologist modules to access their services
    controllers: [DashboardController],
    providers: [],
})
export class DashboardModule { }
