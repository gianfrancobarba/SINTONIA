import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { Visualizzazione_questionariService } from './visualizzazione_questionari.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/questionnaires')
export class Visualizzazione_questionariController {
  constructor(private readonly service: Visualizzazione_questionariService) { }

  /**
   * Ritorna TUTTI i questionari non invalidati (ignora eventuale cf ricevuto)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('psychologist')
  async listNonRevisionati(@Query('cf') cf: string) {
    // Restituisce tutti i questionari non invalidati a prescindere dal CF
    return this.service.getTuttiNonInvalidati();
  }

  /**
   * Ritorna i questionari non invalidati di uno specifico paziente
   */
  @Get('patient/:idPaziente')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('psychologist')
  async listByPaziente(@Param('idPaziente') idPaziente: string) {
    return this.service.getQuestionariByPaziente(idPaziente);
  }

  /**
   * Ritorna il dettaglio completo di un questionario singolo con domande e risposte
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('psychologist')
  async getQuestionarioById(@Param('id') id: string) {
    return this.service.getQuestionarioById(id);
  }
}
