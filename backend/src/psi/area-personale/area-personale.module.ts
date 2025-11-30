import { Module } from '@nestjs/common';
import { AreaPersonaleController } from './area-personale.controller.js';
import { AreaPersonaleService } from './area-personale.service.js';

@Module({
    controllers: [AreaPersonaleController],
    providers: [AreaPersonaleService],
})
export class PsiAreaPersonaleModule { }
