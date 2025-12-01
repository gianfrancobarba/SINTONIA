import { Module } from '@nestjs/common';
import { ScoreService } from './score.service.js';
import { ScoreController } from './score.controller.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

@Module({
    imports: [DrizzleModule],
    providers: [ScoreService],
    controllers: [ScoreController],
    exports: [ScoreService], // Esportato per uso in altri moduli
})
export class ScoreModule { }
