import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { TermsService } from './terms.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';

@Controller('patient/terms')
export class TermsController {
    constructor(private readonly termsService: TermsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async acceptTerms(@Request() req) {
        return this.termsService.acceptTerms(req.user.id);
    }
}
