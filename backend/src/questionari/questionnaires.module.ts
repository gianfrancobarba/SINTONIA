import { Module } from '@nestjs/common';
import { QuestionnairesController } from './questionnaires.controller.js';
import { QuestionnairesService } from './questionnaires.service.js';

@Module({
    controllers: [QuestionnairesController],
    providers: [QuestionnairesService],
    exports: [QuestionnairesService],
})
export class QuestionnairesModule { }
