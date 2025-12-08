import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { AssegnazioneService } from './assegnazione.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';

@Controller('psi/assegnazione')
export class AssegnazioneController {
    constructor(private readonly assegnazioneService: AssegnazioneService) { }

    /**
     * GET /psi/assegnazione/coda
     * Restituisce la coda virtuale dei pazienti non assegnati, ordinata per priorità
     */
    @Get('coda')
    @UseGuards(JwtAuthGuard)
    async getQueue() {
        const queue = await this.assegnazioneService.getQueuedPatients();
        return {
            totalePazientiInCoda: queue.length,
            pazienti: queue.map(p => ({
                idPaziente: p.idPaziente,
                nome: p.nome,
                cognome: p.cognome,
                priorita: p.idPriorita,
                dataScadenza: p.dataScadenza.toISOString(),
            })),
        };
    }

    /**
     * GET /psi/assegnazione/prossimo
     * Restituisce il prossimo paziente da assegnare (primo in coda)
     */
    @Get('prossimo')
    @UseGuards(JwtAuthGuard)
    async getNextPatient() {
        const next = await this.assegnazioneService.getNextPatientInQueue();
        if (!next) {
            return { message: 'Nessun paziente in coda', paziente: null };
        }
        return {
            paziente: {
                idPaziente: next.idPaziente,
                nome: next.nome,
                cognome: next.cognome,
                priorita: next.idPriorita,
                dataScadenza: next.dataScadenza.toISOString(),
            },
        };
    }

    /**
     * GET /psi/assegnazione/psicologo/:id/count
     * Restituisce il numero di pazienti attualmente assegnati a uno psicologo
     */
    @Get('psicologo/:id/count')
    @UseGuards(JwtAuthGuard)
    async getPsychologistPatientCount(@Param('id') psychologistId: string) {
        const count = await this.assegnazioneService.getPsychologistPatientCount(psychologistId);
        const canReceive = await this.assegnazioneService.canPsychologistReceivePatients(psychologistId);
        return {
            psychologistId,
            pazientiAttuali: count,
            massimoConsentito: 8,
            puoRicevereNuoviPazienti: canReceive,
        };
    }

    /**
     * POST /psi/assegnazione/termina-cura
     * Termina la cura di un paziente e assegna il prossimo in coda
     */
    @Post('termina-cura')
    @UseGuards(JwtAuthGuard)
    async terminaCura(
        @Body() body: { idPaziente: string; idPsicologo: string }
    ) {
        const { idPaziente, idPsicologo } = body;

        const nuovoPazienteId = await this.assegnazioneService.terminaCuraEAssegna(
            idPaziente,
            idPsicologo
        );

        return {
            success: true,
            pazienteTerminato: idPaziente,
            nuovoPazienteAssegnato: nuovoPazienteId,
            message: nuovoPazienteId
                ? `Cura terminata. Nuovo paziente ${nuovoPazienteId} assegnato.`
                : 'Cura terminata. Nessun paziente in coda da assegnare.',
        };
    }

    /**
     * POST /psi/assegnazione/nuovo-psicologo
     * Assegna 8 pazienti a un nuovo psicologo
     */
    @Post('nuovo-psicologo')
    @UseGuards(JwtAuthGuard)
    async assignToNewPsychologist(
        @Body() body: { idPsicologo: string }
    ) {
        const { idPsicologo } = body;

        // Verifica che lo psicologo esista e sia attivo
        const isActive = await this.assegnazioneService.isPsychologistActive(idPsicologo);
        if (!isActive) {
            return {
                success: false,
                message: 'Psicologo non trovato o non attivo',
            };
        }

        const assignedPatients = await this.assegnazioneService.assignPatientsToNewPsychologist(idPsicologo);

        return {
            success: true,
            idPsicologo,
            pazientiAssegnati: assignedPatients.length,
            idPazienti: assignedPatients,
            message: `Assegnati ${assignedPatients.length} pazienti al nuovo psicologo.`,
        };
    }
}
