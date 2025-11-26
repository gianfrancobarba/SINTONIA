import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ASModule } from '../amministratore/AS.module';

@Module({
    imports: [ASModule], // Importing ASModule to access AdminDashboardService
    controllers: [DashboardController],
    providers: [],
})
export class DashboardModule { }
