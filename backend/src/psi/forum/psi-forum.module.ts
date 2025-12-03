import { Module } from '@nestjs/common';
import { PsiForumService } from './psi-forum.service.js';
import { PsiForumController } from './psi-forum.controller.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

@Module({
    imports: [DrizzleModule],
    controllers: [PsiForumController],
    providers: [PsiForumService],
    exports: [PsiForumService],
})
export class PsiForumModule { }
