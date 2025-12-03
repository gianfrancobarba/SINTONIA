import { Controller, Patch, Param, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { Modifica_priorita_paziente_amministratoreService } from './modifica_priorita_paziente_amministratore.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('admin/patients')
export class Modifica_priorita_paziente_amministratoreController {
    constructor(private readonly service: Modifica_priorita_paziente_amministratoreService) { }

    /**
     * Modifica la priorità di un paziente
     * Endpoint: PATCH /admin/patients/:id/priority
     */
    @Patch(':id/priority')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async modificaPriorita(
        @Param('id') id: string,
        @Body() body: { idPriorita: string }
    ) {
        if (!body.idPriorita) {
            throw new BadRequestException('Il campo idPriorita è obbligatorio');
        }
        return this.service.modificaPrioritaPaziente(id, body.idPriorita);
    }
}
