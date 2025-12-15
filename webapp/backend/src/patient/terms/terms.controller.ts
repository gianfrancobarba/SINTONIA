import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { TermsService } from './terms.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { SpidAuthService } from '../../spid-auth/spid-auth.service.js';

@Controller('patient/terms')
export class TermsController {
    constructor(
        private readonly termsService: TermsService,
        private readonly spidAuthService: SpidAuthService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async acceptTerms(@Request() req) {
        const patient = await this.termsService.acceptTerms(req.user.id);
        return this.spidAuthService.generateToken(patient);
    }
}
