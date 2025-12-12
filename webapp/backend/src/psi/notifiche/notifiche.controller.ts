import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { NotificheService } from './notifiche.service.js';
import { PaginatedNotificationsDto, NotificationCountDto } from './dto/notification.dto.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/notifiche')
export class NotificheController {
    constructor(private readonly notificheService: NotificheService) { }

    /**
     * Recupera le notifiche paginate per uno psicologo
     * GET /psi/notifiche?cf=CODICEFISCALE&page=1
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async getNotifications(
        @Query('cf') codiceFiscale: string,
        @Query('page') page: string = '1',
    ): Promise<PaginatedNotificationsDto> {
        return this.notificheService.getNotifications(codiceFiscale, parseInt(page) || 1);
    }

    /**
     * Recupera il conteggio delle notifiche non lette
     * GET /psi/notifiche/count?cf=CODICEFISCALE
     */
    @Get('count')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async getUnreadCount(
        @Query('cf') codiceFiscale: string,
    ): Promise<NotificationCountDto> {
        return this.notificheService.getUnreadCount(codiceFiscale);
    }

    /**
     * Segna una notifica come letta
     * PATCH /psi/notifiche/:id/read
     */
    @Patch(':id/read')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async markAsRead(@Param('id') idNotifica: string): Promise<void> {
        return this.notificheService.markAsRead(idNotifica);
    }

    /**
     * Segna tutte le notifiche come lette
     * PATCH /psi/notifiche/read-all?cf=CODICEFISCALE
     */
    @Patch('read-all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async markAllAsRead(@Query('cf') codiceFiscale: string): Promise<void> {
        return this.notificheService.markAllAsRead(codiceFiscale);
    }
}
