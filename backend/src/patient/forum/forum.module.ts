import { Module } from '@nestjs/common';
import { ForumService } from './forum.service.js';
import { ForumController } from './forum.controller.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

@Module({
    imports: [DrizzleModule],
    controllers: [ForumController],
    providers: [ForumService],
    exports: [ForumService],
})
export class ForumModule { }
