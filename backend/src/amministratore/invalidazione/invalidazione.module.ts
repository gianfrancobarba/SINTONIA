import { Module } from '@nestjs/common';
import { Visualizzazione_invalidazioneController } from './visualizzazione_invalidazione.controller.js';
import { Visualizzazione_invalidazioneService } from './visualizzazione_invalidazione.service.js';
import { Accettazione_invalidazioneController } from './accettazione_invalidazione.controller.js';
import { Accettazione_invalidazioneService } from './accettazione_invalidazione.service.js';
import { Rifiuto_invalidazioneController } from './rifiuto_invalidazione.controller.js';
import { Rifiuto_invalidazioneService } from './rifiuto_invalidazione.service.js';

@Module({
    controllers: [
        Visualizzazione_invalidazioneController,
        Accettazione_invalidazioneController,
        Rifiuto_invalidazioneController,
    ],
    providers: [
        Visualizzazione_invalidazioneService,
        Accettazione_invalidazioneService,
        Rifiuto_invalidazioneService,
    ],
})
export class InvalidazioneModule { }
