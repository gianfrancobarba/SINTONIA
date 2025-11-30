import { Module } from '@nestjs/common';
import { Visualizzazione_psicologi_amministratoreController } from './visualizzazione_psicologi_amministratore.controller.js';
import { Visualizzazione_psicologi_amministratoreService } from './visualizzazione_psicologi_amministratore.service.js';
import { Ricerca_psicologi_amministratoreController } from './ricerca_psicologi_amministratore.controller.js';
import { Ricerca_psicologi_amministratoreService } from './ricerca_psicologi_amministratore.service.js';
import { Creazione_psicologo_amministratoreController } from './creazione_psicologo_amministratore.controller.js';
import { Creazione_psicologo_amministratoreService } from './creazione_psicologo_amministratore.service.js';

import { Modifica_psicologo_amministratoreController } from './modifica_psicologo_amministratore.controller.js';
import { Modifica_psicologo_amministratoreService } from './modifica_psicologo_amministratore.service.js';

@Module({
    controllers: [Visualizzazione_psicologi_amministratoreController, Ricerca_psicologi_amministratoreController, Creazione_psicologo_amministratoreController, Modifica_psicologo_amministratoreController],
    providers: [Visualizzazione_psicologi_amministratoreService, Ricerca_psicologi_amministratoreService, Creazione_psicologo_amministratoreService, Modifica_psicologo_amministratoreService],
})
export class Psicologi_amministratoreModule { }
