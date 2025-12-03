import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { PrioritaService } from './priorita.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { PatientPrioritaDto } from './dto/priorita.dto.js';

@Controller('paziente/priorita')
export class PrioritaController {
    constructor(private readonly prioritaService: PrioritaService) { }

    /**
     * Ottiene la priorità corrente del paziente autenticato
     */
    @Get()
    @UseGuards(JwtAuthGuard)
    async getPriorita(@Req() req): Promise<PatientPrioritaDto> {
        const userId = req.user.userId;
        return this.prioritaService.getPatientPriorita(userId);
    }
}
