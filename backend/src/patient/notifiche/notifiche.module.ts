import { Module } from '@nestjs/common';
import { PatientNotificheService } from './notifiche.service.js';
import { PatientNotificheController } from './notifiche.controller.js';

@Module({
    controllers: [PatientNotificheController],
    providers: [PatientNotificheService],
    exports: [PatientNotificheService],
})
export class PatientNotificheModule { }
