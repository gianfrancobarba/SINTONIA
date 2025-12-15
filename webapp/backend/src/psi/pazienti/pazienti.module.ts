import { Module } from '@nestjs/common';
import { Visualizzazione_pazientiController } from './visualizzazione_pazienti.controller.js';
import { Visualizzazione_pazientiService } from './visualizzazione_pazienti.service.js';
import { Ricerca_pazientiController } from './ricerca_pazienti.controller.js';
import { Ricerca_pazientiService } from './ricerca_pazienti.service.js';
import { TerminaCuraController } from './termina-cura.controller.js';
import { TerminaCuraService } from './termina-cura.service.js';
import { AssegnazioneModule } from '../assegnazione/assegnazione.module.js';

@Module({
    imports: [AssegnazioneModule],
    controllers: [Visualizzazione_pazientiController, Ricerca_pazientiController, TerminaCuraController],
    providers: [Visualizzazione_pazientiService, Ricerca_pazientiService, TerminaCuraService],
})
export class PazientiModule { }
