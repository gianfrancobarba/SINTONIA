import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { Rimozione_paziente_amministratoreService } from './rimozione_paziente_amministratore.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/patients')
export class Rimozione_paziente_amministratoreController {
    constructor(
        private readonly service: Rimozione_paziente_amministratoreService
    ) { }

    /**
     * Rimuove un paziente dalla lista d'attesa (soft delete)
     * Endpoint: DELETE /admin/patients/:id
     * @param id - UUID del paziente
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async rimuoviPaziente(@Param('id') id: string) {
        return this.service.rimuoviPaziente(id);
    }
}
