import { Module } from '@nestjs/common';
import { Visualizzazione_psicologi_amministratoreController } from './visualizzazione_psicologi_amministratore.controller.js';
import { Visualizzazione_psicologi_amministratoreService } from './visualizzazione_psicologi_amministratore.service.js';

@Module({
    controllers: [Visualizzazione_psicologi_amministratoreController],
    providers: [Visualizzazione_psicologi_amministratoreService],
})
export class Psicologi_amministratoreModule { }
