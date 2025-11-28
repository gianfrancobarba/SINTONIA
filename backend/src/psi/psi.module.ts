import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { QuestionariModule } from './questionari/questionari.module.js';
import { PazientiModule } from './pazienti/pazienti.module.js';

@Module({
    imports: [DashboardModule, QuestionariModule, PazientiModule],
})
export class PsiModule { }