import { Module } from '@nestjs/common';
import { Visualizzazione_invalidazioneController } from './visualizzazione_invalidazione.controller.js';
import { Visualizzazione_invalidazioneService } from './visualizzazione_invalidazione.service.js';

@Module({
    controllers: [Visualizzazione_invalidazioneController],
    providers: [Visualizzazione_invalidazioneService],
})
export class InvalidazioneModule { }
