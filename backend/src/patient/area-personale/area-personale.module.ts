import { Module } from '@nestjs/common';
import { AreaPersonaleController } from './area-personale.controller.js';
import { AreaPersonaleService } from './area-personale.service.js';
import { StatoAnimoModule } from '../stato-animo/stato-animo.module.js';
import { DiarioModule } from '../diario/diario.module.js';
import { BadgeModule } from '../badge/badge.module.js';
import { HomeService } from '../home/home.service.js';

@Module({
    imports: [StatoAnimoModule, DiarioModule, BadgeModule],
    controllers: [AreaPersonaleController],
    providers: [AreaPersonaleService, HomeService],
    exports: [AreaPersonaleService],
})
export class AreaPersonaleModule { }
