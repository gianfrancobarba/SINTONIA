import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { QuestionariModule } from './questionari/questionari.module.js';
import { PsiForumModule } from './forum/psi-forum.module.js';
import { PazientiModule } from './pazienti/pazienti.module.js';

@Module({
    imports: [DashboardModule, QuestionariModule, PazientiModule, PsiForumModule],
})
export class PsiModule { }