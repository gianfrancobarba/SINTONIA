import { Module } from '@nestjs/common';
import { PrioritaService } from './priorita.service.js';
import { PrioritaController } from './priorita.controller.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

@Module({
    imports: [DrizzleModule],
    providers: [PrioritaService],
    controllers: [PrioritaController],
    exports: [PrioritaService], // Esportato per uso in ScoreService
})
export class PrioritaModule { }
