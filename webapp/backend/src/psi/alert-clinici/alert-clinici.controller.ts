import { Controller, Get, Patch, Param, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { AlertCliniciService } from './alert-clinici.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/clinical-alerts')
export class AlertCliniciController {
    constructor(private readonly alertCliniciService: AlertCliniciService) { }

    /**
     * Endpoint per ottenere tutti gli alert clinici non ancora accettati
     * Accessibile solo agli psicologi autenticati
     * Gli alert sono visibili da tutti gli psicologi (pool condiviso)
     * 
     * @returns Lista di alert non accettati (solo campi tabella alert_clinico)
     * 
     * Esempio risposta:
     * [
     *   {
     *     idAlert: "uuid-123",
     *     dataAlert: "2025-11-30T14:20:00Z",
     *     stato: false
     *   }
     * ]
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async getAlertNonAccettati() {
        return this.alertCliniciService.getAlertNonAccettati();
    }

    /**
     * Endpoint per accettare un alert clinico
     * Lo psicologo prende in carico il paziente dell'alert
     * Gestisce race condition: se due psicologi accettano contemporaneamente, solo uno avrà successo
     * 
     * @param idAlert - UUID dell'alert da accettare
     * @param codiceFiscalePsicologo - Codice fiscale dello psicologo (nel body)
     * @returns Alert aggiornato con accettato=true e idPsicologo valorizzato
     * @throws BadRequestException se il codice fiscale è mancante
     * @throws ConflictException se l'alert è già stato accettato
     * 
     * Esempio body:
     * {
     *   "codiceFiscalePsicologo": "RSSMRA85M01H501Z"
     * }
     * 
     * Esempio risposta:
     * {
     *   "idAlert": "uuid-123",
     *   "dataAlert": "2025-11-30T14:20:00Z",
     *   "accettato": true,
     *   "idPsicologo": "RSSMRA85M01H501Z",
     *   "idPaziente": "uuid-456"
     * }
     */
    @Patch(':id/accept')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async accettaAlert(
        @Param('id') idAlert: string,
        @Body('codiceFiscalePsicologo') codiceFiscalePsicologo: string,
    ) {
        // Validazione input
        if (!codiceFiscalePsicologo) {
            throw new BadRequestException('Codice fiscale psicologo richiesto');
        }

        return this.alertCliniciService.accettaAlert(idAlert, codiceFiscalePsicologo);
    }
}

