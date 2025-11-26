import { Module } from '@nestjs/common';
import { HomeController } from './home/home.controller.js';
import { HomeService } from './home/home.service.js';
import { TermsController } from './terms/terms.controller.js';
import { TermsService } from './terms/terms.service.js';

@Module({
    controllers: [HomeController, TermsController],
    providers: [HomeService, TermsService],
})
export class PatientModule { }
