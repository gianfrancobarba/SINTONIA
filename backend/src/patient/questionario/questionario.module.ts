import { Module } from '@nestjs/common';
import { Visualizzazione_lista_questionariController } from './visualizzazione_lista/visualizzazione_lista_questionari.controller.js';
import { Visualizzazione_lista_questionariService } from './visualizzazione_lista/visualizzazione_lista_questionari.service.js';
import { Compilazione_questionarioController } from './compilazione/compilazione_questionario.controller.js';
import { Compilazione_questionarioService } from './compilazione/compilazione_questionario.service.js';

@Module({
  controllers: [
    Visualizzazione_lista_questionariController,
    Compilazione_questionarioController,
  ],
  providers: [
    Visualizzazione_lista_questionariService,
    Compilazione_questionarioService,
  ],
  exports: [
    Visualizzazione_lista_questionariService,
    Compilazione_questionarioService,
  ],
})
export class QuestionarioModule {}
