import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { QuestionariModule } from './questionari/questionari.module.js';

@Module({
    imports: [DashboardModule, QuestionariModule],
})
export class PsiModule { }