import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller.js';
import { SettingsService } from './settings.service.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

@Module({
    imports: [DrizzleModule],
    controllers: [SettingsController],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule { }
