import { Module } from '@nestjs/common';
import { PsiForumService } from './psi-forum.service.js';
import { PsiForumController } from './psi-forum.controller.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';
import { BadgeService } from '../../patient/badge/badge.service.js';

@Module({
    imports: [DrizzleModule],
    controllers: [PsiForumController],
    providers: [PsiForumService, BadgeService],
    exports: [PsiForumService],
})
export class PsiForumModule { }
