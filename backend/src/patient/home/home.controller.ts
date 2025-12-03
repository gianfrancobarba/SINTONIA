import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { HomeService } from './home.service.js';
import { HomeDashboardDto } from './dto/home-dashboard.dto.js';
import type { Request } from 'express';

@Controller('paziente/home')
export class HomeController {
    constructor(private readonly homeService: HomeService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getDashboard(@Req() req: Request): Promise<HomeDashboardDto> {
        // In a real app, req.user would be populated by the guard.
        // For now, we'll cast it or use a default if missing for testing.
        const userId = (req as any).user?.id;
        return this.homeService.getDashboard(userId);
    }
}
