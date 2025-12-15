import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ScoreService } from './score.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { PatientScoreDto } from './dto/score.dto.js';

@Controller('paziente/score')
export class ScoreController {
    constructor(private readonly scoreService: ScoreService) { }

    /**
     * Ottiene lo score corrente del paziente autenticato
     */
    @Get()
    @UseGuards(JwtAuthGuard)
    async getScore(@Req() req): Promise<PatientScoreDto> {
        const userId = req.user.userId;
        return this.scoreService.getPatientScore(userId);
    }
}
