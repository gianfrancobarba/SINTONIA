import { Module } from '@nestjs/common';
import { AlertService } from './alert.service.js';
import { AlertController } from './alert.controller.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

@Module({
    imports: [DrizzleModule],
    providers: [AlertService],
    controllers: [AlertController],
    exports: [AlertService], // Esportato per uso in compilazione questionario
})
export class AlertModule { }
