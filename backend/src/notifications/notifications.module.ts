import { Module, Global } from '@nestjs/common';
import { NotificationHelperService } from './notification-helper.service.js';

@Global()
@Module({
    providers: [NotificationHelperService],
    exports: [NotificationHelperService],
})
export class NotificationsModule { }
