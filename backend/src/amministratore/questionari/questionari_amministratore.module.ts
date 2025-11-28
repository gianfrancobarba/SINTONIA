import { Module } from '@nestjs/common';
import { Visualizzazione_questionari_amministratoreController } from './visualizzazione_questionari_amministratore.controller.js';
import { Visualizzazione_questionari_amministratoreService } from './visualizzazione_questionari_amministratore.service.js';

@Module({
    controllers: [Visualizzazione_questionari_amministratoreController],
    providers: [Visualizzazione_questionari_amministratoreService],
})
export class Questionari_amministratoreModule { }
