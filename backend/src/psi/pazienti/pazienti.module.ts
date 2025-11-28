import { Module } from '@nestjs/common';
import { Visualizzazione_pazientiController } from './visualizzazione_pazienti.controller.js';
import { Visualizzazione_pazientiService } from './visualizzazione_pazienti.service.js';

@Module({
    controllers: [Visualizzazione_pazientiController],
    providers: [Visualizzazione_pazientiService],
})
export class PazientiModule { }
