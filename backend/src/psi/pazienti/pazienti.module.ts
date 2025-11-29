import { Module } from '@nestjs/common';
import { Visualizzazione_pazientiController } from './visualizzazione_pazienti.controller.js';
import { Visualizzazione_pazientiService } from './visualizzazione_pazienti.service.js';
import { Ricerca_pazientiController } from './ricerca_pazienti.controller.js';
import { Ricerca_pazientiService } from './ricerca_pazienti.service.js';

@Module({
    controllers: [Visualizzazione_pazientiController, Ricerca_pazientiController],
    providers: [Visualizzazione_pazientiService, Ricerca_pazientiService],
})
export class PazientiModule { }
