import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Visualizzazione_questionariService } from './visualizzazione_questionari.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/questionnaires')
export class Visualizza_questionariController {
  constructor(private readonly service: Visualizzazione_questionariService) {}

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
}
