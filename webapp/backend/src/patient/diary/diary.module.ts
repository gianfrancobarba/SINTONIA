import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller.js';
import { DiaryService } from './diary.service.js';
import { CreateDiaryPageController } from './create-diary-page.controller.js';
import { CreateDiaryPageService } from './create-diary-page.service.js';
import { UpdateDiaryPageController } from './update-diary-page.controller.js';
import { UpdateDiaryPageService } from './update-diary-page.service.js';
import { DeleteDiaryPageController } from './delete-diary-page.controller.js';
import { DeleteDiaryPageService } from './delete-diary-page.service.js';
import { BadgeModule } from '../badge/badge.module.js';

@Module({
    imports: [BadgeModule],
    controllers: [
        DiaryController,
        CreateDiaryPageController,
        UpdateDiaryPageController,
        DeleteDiaryPageController,
    ],
    providers: [
        DiaryService,
        CreateDiaryPageService,
        UpdateDiaryPageService,
        DeleteDiaryPageService,
    ],
    exports: [
        DiaryService,
    ],
})
export class DiaryModule { }
