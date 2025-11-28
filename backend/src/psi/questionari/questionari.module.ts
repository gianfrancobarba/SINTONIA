import { Module } from '@nestjs/common';
import { Visualizzazione_questionariController } from './visualizzazione_questionari.controller.js';
import { Visualizzazione_questionariService } from './visualizzazione_questionari.service.js';
import { RichiestaInvalidazioneController } from './richiesta_invalidazione.controller.js';
import { RichiestaInvalidazioneService } from './richiesta_invalidazione.service.js';
import { RolesGuard } from '../../auth/roles.guard.js';

@Module({
  controllers: [
    Visualizzazione_questionariController,
    RichiestaInvalidazioneController,
  ],
  providers: [
    Visualizzazione_questionariService,
    RichiestaInvalidazioneService,
    RolesGuard,
  ],
  exports: [Visualizzazione_questionariService],
})
export class QuestionariModule { }
