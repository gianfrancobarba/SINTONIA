import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AdminForumService } from './admin-forum.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/forum')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminForumController {
    constructor(private readonly forumService: AdminForumService) { }

    @Get('all')
    async getAllQuestions(@Query('categoria') categoria?: string) {
        // Ritorna tutte le domande
        return this.forumService.getAllQuestions(categoria);
    }
}
