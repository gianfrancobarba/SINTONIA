import { Module } from '@nestjs/common';
import { Visualizzazione_pazienti_amministratoreController } from './visualizzazione_pazienti_amministratore.controller.js';
import { Visualizzazione_pazienti_amministratoreService } from './visualizzazione_pazienti_amministratore.service.js';
import { Ricerca_pazienti_amministratoreController } from './ricerca_pazienti_amministratore.controller.js';
import { Ricerca_pazienti_amministratoreService } from './ricerca_pazienti_amministratore.service.js';
import { Modifica_paziente_amministratoreController } from './modifica_paziente_amministratore.controller.js';
import { Modifica_paziente_amministratoreService } from './modifica_paziente_amministratore.service.js';

@Module({
    controllers: [Visualizzazione_pazienti_amministratoreController, Ricerca_pazienti_amministratoreController, Modifica_paziente_amministratoreController],
    providers: [Visualizzazione_pazienti_amministratoreService, Ricerca_pazienti_amministratoreService, Modifica_paziente_amministratoreService],
})
export class Pazienti_amministratoreModule { }

