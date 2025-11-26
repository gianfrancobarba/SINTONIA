import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module.js';

@Module({
    imports: [DashboardModule],
})
export class PsiModule { }