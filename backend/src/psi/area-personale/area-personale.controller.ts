import { Controller, Get, Put, Body, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AreaPersonaleService } from './area-personale.service.js';
import { UpdatePsiProfileDto } from './dto/update-profile.dto.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
    @UseInterceptors(FileInterceptor('immagineProfilo', {
        storage: diskStorage({
            destination: './backend/uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async updateProfile(
        @Query('cf') codiceFiscale: string,
        @Body() updateDto: UpdatePsiProfileDto,
        @UploadedFile() file: any
    ) {
        if (file) {
            updateDto.immagineProfilo = file.filename;
        }
        return this.areaPersonaleService.updateProfile(codiceFiscale, updateDto);
    }
}
