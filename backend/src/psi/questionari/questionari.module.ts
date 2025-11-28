import { Module } from '@nestjs/common';
import { Visualizzazione_questionariController } from './visualizzazione_questionari.controller.js';
import { Visualizzazione_questionariService } from './visualizzazione_questionari.service.js';
import { RolesGuard } from '../../auth/roles.guard.js';

@Module({
  controllers: [Visualizzazione_questionariController],
  providers: [Visualizzazione_questionariService, RolesGuard],
  exports: [Visualizzazione_questionariService],
})
export class QuestionariModule {}
