import { Module } from '@nestjs/common';
import { Visualizzazione_questionariController } from './visualizzazione_questionari.controller.js';
import { Visualizzazione_questionariService } from './visualizzazione_questionari.service.js';
import { RichiestaInvalidazioneController } from './richiesta_invalidazione.controller.js';
import { RichiestaInvalidazioneService } from './richiesta_invalidazione.service.js';
import { RevisioneQuestionarioController } from './revisione_questionario.controller.js';
import { RevisioneQuestionarioService } from './revisione_questionario.service.js';
import { RolesGuard } from '../../auth/roles.guard.js';

@Module({
  controllers: [
    Visualizzazione_questionariController,
    RichiestaInvalidazioneController,
    RevisioneQuestionarioController,
  ],
  providers: [
    Visualizzazione_questionariService,
    RichiestaInvalidazioneService,
    RevisioneQuestionarioService,
    RolesGuard,
  ],
  exports: [Visualizzazione_questionariService],
})
export class QuestionariModule { }
