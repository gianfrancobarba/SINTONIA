import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Ricerca_pazienti_amministratoreService } from './ricerca_pazienti_amministratore.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/patients/search')
export class Ricerca_pazienti_amministratoreController {
    constructor(private readonly service: Ricerca_pazienti_amministratoreService) { }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async searchById(@Param('id') id: string) {
        return this.service.cercaPazientePerId(id);
    }
}
