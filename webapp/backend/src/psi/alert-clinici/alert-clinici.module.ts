import { Module } from '@nestjs/common';
import { AlertCliniciController } from './alert-clinici.controller.js';
import { AlertCliniciService } from './alert-clinici.service.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

@Module({
    imports: [DrizzleModule],
    controllers: [AlertCliniciController],
    providers: [AlertCliniciService],
})
export class AlertCliniciModule { }
