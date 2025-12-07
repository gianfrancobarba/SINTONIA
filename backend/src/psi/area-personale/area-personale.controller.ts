import { Controller, Get, Put, Body, Query, UseGuards } from '@nestjs/common';
import { AreaPersonaleService } from './area-personale.service.js';
import { UpdatePsiProfileDto } from './dto/update-profile.dto.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/area-personale')
export class AreaPersonaleController {
    constructor(private readonly areaPersonaleService: AreaPersonaleService) { }

    @Get('me')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async getProfile(@Query('cf') codiceFiscale: string) {
        return this.areaPersonaleService.getProfile(codiceFiscale);
    }

    @Put('me')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async updateProfile(
        @Query('cf') codiceFiscale: string,
        @Body() updateDto: UpdatePsiProfileDto
    ) {
        return this.areaPersonaleService.updateProfile(codiceFiscale, updateDto);
    }
}
