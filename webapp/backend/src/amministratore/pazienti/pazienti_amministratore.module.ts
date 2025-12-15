import { Module } from '@nestjs/common';
import { Visualizzazione_pazienti_amministratoreController } from './visualizzazione_pazienti_amministratore.controller.js';
import { Visualizzazione_pazienti_amministratoreService } from './visualizzazione_pazienti_amministratore.service.js';
import { Ricerca_pazienti_amministratoreController } from './ricerca_pazienti_amministratore.controller.js';
import { Ricerca_pazienti_amministratoreService } from './ricerca_pazienti_amministratore.service.js';
import { Modifica_paziente_amministratoreController } from './modifica_paziente_amministratore.controller.js';
import { Modifica_paziente_amministratoreService } from './modifica_paziente_amministratore.service.js';
import { Rimozione_paziente_amministratoreController } from './rimozione_paziente_amministratore.controller.js';
import { Rimozione_paziente_amministratoreService } from './rimozione_paziente_amministratore.service.js';
import { Modifica_priorita_paziente_amministratoreController } from './modifica_priorita_paziente_amministratore.controller.js';
import { Modifica_priorita_paziente_amministratoreService } from './modifica_priorita_paziente_amministratore.service.js';

import { AssegnazionePsicologoAmministratoreController } from './assegnazione_psicologo_amministratore.controller.js';
import { AssegnazionePsicologoAmministratoreService } from './assegnazione_psicologo_amministratore.service.js';
import { AssegnazioneService } from '../../psi/assegnazione/assegnazione.service.js';

@Module({
    controllers: [
        Visualizzazione_pazienti_amministratoreController,
        Ricerca_pazienti_amministratoreController,
        Modifica_paziente_amministratoreController,
        Modifica_priorita_paziente_amministratoreController,
        Rimozione_paziente_amministratoreController,
        AssegnazionePsicologoAmministratoreController
    ],
    providers: [
        Visualizzazione_pazienti_amministratoreService,
        Ricerca_pazienti_amministratoreService,
        Modifica_paziente_amministratoreService,
        Modifica_priorita_paziente_amministratoreService,
        Rimozione_paziente_amministratoreService,
        AssegnazionePsicologoAmministratoreService,
        AssegnazioneService
    ],
})
export class Pazienti_amministratoreModule { }
