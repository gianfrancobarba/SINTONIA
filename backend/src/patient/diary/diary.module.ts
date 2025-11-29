import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller.js';
import { DiaryService } from './diary.service.js';

@Module({
    controllers: [DiaryController],
    providers: [DiaryService],
})
export class DiaryModule { }
