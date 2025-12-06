import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { AdminNotificheService } from './notifiche.service.js';
import { AdminPaginatedNotificationsDto, AdminNotificationCountDto } from './dto/notification.dto.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/notifiche')
export class AdminNotificheController {
    constructor(private readonly notificheService: AdminNotificheService) { }

    /**
     * Recupera le notifiche paginate per un amministratore
     * GET /admin/notifiche?email=EMAIL&page=1
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async getNotifications(
        @Query('email') email: string,
        @Query('page') page: string = '1',
    ): Promise<AdminPaginatedNotificationsDto> {
        return this.notificheService.getNotifications(email, parseInt(page) || 1);
    }

    /**
     * Recupera il conteggio delle notifiche non lette
     * GET /admin/notifiche/count?email=EMAIL
     */
    @Get('count')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async getUnreadCount(
        @Query('email') email: string,
    ): Promise<AdminNotificationCountDto> {
        return this.notificheService.getUnreadCount(email);
    }

    /**
     * Segna una notifica come letta
     * PATCH /admin/notifiche/:id/read
     */
    @Patch(':id/read')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async markAsRead(@Param('id') idNotifica: string): Promise<void> {
        return this.notificheService.markAsRead(idNotifica);
    }

    /**
     * Segna tutte le notifiche come lette
     * PATCH /admin/notifiche/read-all?email=EMAIL
     */
    @Patch('read-all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async markAllAsRead(@Query('email') email: string): Promise<void> {
        return this.notificheService.markAllAsRead(email);
    }
}
