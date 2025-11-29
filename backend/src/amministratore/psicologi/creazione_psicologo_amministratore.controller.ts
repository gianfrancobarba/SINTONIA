import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Creazione_psicologo_amministratoreService } from './creazione_psicologo_amministratore.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';
import { CreaPsicologoDto } from './dto/crea-psicologo.dto.js';

@Controller('admin/psychologists')
export class Creazione_psicologo_amministratoreController {
    constructor(
        private readonly service: Creazione_psicologo_amministratoreService
    ) { }

    /**
     * Crea un nuovo psicologo
     * Endpoint: POST /admin/psychologists
     */
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async crea(@Body() dto: CreaPsicologoDto) {
        return this.service.creaPsicologo(dto);
    }
}
