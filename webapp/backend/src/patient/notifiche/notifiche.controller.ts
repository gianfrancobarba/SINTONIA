import { Controller, Get, Patch, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PatientNotificheService } from './notifiche.service.js';
import { PaginatedNotificationsDto, NotificationCountDto } from './dto/notification.dto.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';
import type { Request } from 'express';

@Controller('paziente/notifiche')
export class PatientNotificheController {
    constructor(private readonly notificheService: PatientNotificheService) { }

    /**
     * Recupera le notifiche paginate per il paziente autenticato
     * GET /patient/notifiche?page=1
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('patient')
    async getNotifications(
        @Req() req: Request,
        @Query('page') page: string = '1',
    ): Promise<PaginatedNotificationsDto> {
        const idPaziente = (req as any).user?.id;
        return this.notificheService.getNotifications(idPaziente, parseInt(page) || 1);
    }

    /**
     * Recupera il conteggio delle notifiche non lette
     * GET /patient/notifiche/count
     */
    @Get('count')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('patient')
    async getUnreadCount(@Req() req: Request): Promise<NotificationCountDto> {
        const idPaziente = (req as any).user?.id;
        return this.notificheService.getUnreadCount(idPaziente);
    }

    /**
     * Segna una notifica come letta
     * PATCH /patient/notifiche/:id/read
     */
    @Patch(':id/read')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('patient')
    async markAsRead(@Param('id') idNotifica: string): Promise<void> {
        return this.notificheService.markAsRead(idNotifica);
    }

    /**
     * Segna tutte le notifiche come lette
     * PATCH /patient/notifiche/read-all
     */
    @Patch('read-all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('patient')
    async markAllAsRead(@Req() req: Request): Promise<void> {
        const idPaziente = (req as any).user?.id;
        return this.notificheService.markAllAsRead(idPaziente);
    }
}
