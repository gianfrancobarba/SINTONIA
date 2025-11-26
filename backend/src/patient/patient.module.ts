import { Module } from '@nestjs/common';
import { HomeController } from './home/home.controller.js';
import { HomeService } from './home/home.service.js';

@Module({
    controllers: [HomeController],
    providers: [HomeService],
})
export class PatientModule { }
