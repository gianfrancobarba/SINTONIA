import { Module } from '@nestjs/common';
import { HomeController } from './home/home.controller.js';
import { HomeService } from './home/home.service.js';
import { TermsController } from './terms/terms.controller.js';
import { TermsService } from './terms/terms.service.js';
import { ForumModule } from './forum/forum.module.js';
import { SpidAuthModule } from '../spid-auth/spid-auth.module.js';
import { QuestionarioModule } from './questionario/questionario.module.js';
import { StatoAnimoModule } from './stato-animo/stato-animo.module.js';
import { DiaryModule } from './diary/diary.module.js';
import { BadgeModule } from './badge/badge.module.js';
import { AreaPersonaleModule } from './area-personale/area-personale.module.js';
import { SettingsModule } from './settings/settings.module.js';
import { ScoreModule } from './score/score.module.js';
import { PrioritaModule } from './priorita/priorita.module.js';
import { AlertModule } from './alert/alert.module.js';

@Module({
    imports: [
        SpidAuthModule,
        QuestionarioModule,
        ForumModule,
        StatoAnimoModule,
        DiaryModule,
        BadgeModule,
        ScoreModule,
        PrioritaModule,
        AlertModule,
        AreaPersonaleModule,
        SettingsModule,
    ],
    controllers: [
        HomeController,
        TermsController,
    ],
    providers: [
        HomeService,
        TermsService,
    ],
})
export class PatientModule { }
