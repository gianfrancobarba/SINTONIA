import { Module } from '@nestjs/common';
import { AssegnazioneController } from './assegnazione.controller.js';
import { AssegnazioneService } from './assegnazione.service.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

@Module({
    imports: [DrizzleModule],
    controllers: [AssegnazioneController],
    providers: [AssegnazioneService],
    exports: [AssegnazioneService],
})
export class AssegnazioneModule { }
