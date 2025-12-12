import { Module } from '@nestjs/common';
import { Visualizzazione_questionari_amministratoreController } from './visualizzazione_questionari_amministratore.controller.js';
import { Visualizzazione_questionari_amministratoreService } from './visualizzazione_questionari_amministratore.service.js';
import { AnnullamentoRevisioneController } from './annullamento_revisione.controller.js';
import { AnnullamentoRevisioneService } from './annullamento_revisione.service.js';

@Module({
    controllers: [
        Visualizzazione_questionari_amministratoreController,
        AnnullamentoRevisioneController,
    ],
    providers: [
        Visualizzazione_questionari_amministratoreService,
        AnnullamentoRevisioneService,
    ],
})
export class Questionari_amministratoreModule { }
