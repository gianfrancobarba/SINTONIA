import { Module } from '@nestjs/common';
import { BadgeController } from './badge.controller.js';
import { BadgeService } from './badge.service.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

@Module({
    imports: [DrizzleModule],
    controllers: [BadgeController],
    providers: [BadgeService],
    exports: [BadgeService],
})
export class BadgeModule { }
