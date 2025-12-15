import { Module } from '@nestjs/common';
import { AdminForumService } from './admin-forum.service.js';
import { AdminForumController } from './admin-forum.controller.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

@Module({
    imports: [DrizzleModule],
    controllers: [AdminForumController],
    providers: [AdminForumService],
    exports: [AdminForumService],
})
export class AdminForumModule { }
