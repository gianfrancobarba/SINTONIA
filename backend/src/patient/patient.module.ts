import { Module } from '@nestjs/common';
import { HomeController } from './home/home.controller.js';
import { HomeService } from './home/home.service.js';
import { TermsController } from './terms/terms.controller.js';
import { TermsService } from './terms/terms.service.js';
import { QuestionarioController } from './questionario/questionario.controller.js';
import { QuestionarioService } from './questionario/questionario.service.js';
import { QuestionariListController } from './questionariList/questionariList.controller.js';
import { QuestionariListService } from './questionariList/questionariList.service.js';
import { QuestionariController } from './questionari/questionari.controller.js';
import { QuestionariService } from './questionari/questionari.service.js';

import { SpidAuthModule } from '../spid-auth/spid-auth.module.js';

@Module({
    imports: [SpidAuthModule],
    controllers: [
        HomeController,
        TermsController,
        QuestionarioController,
        QuestionariListController,
        QuestionariController,
    ],
    providers: [
        HomeService,
        TermsService,
        QuestionarioService,
        QuestionariListService,
        QuestionariService,
    ],
})
export class PatientModule { }
