import { Module } from '@nestjs/common';
import { DiarioController } from './diario.controller.js';
import { DiarioService } from './diario.service.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

@Module({
    imports: [DrizzleModule],
    controllers: [DiarioController],
    providers: [DiarioService],
    exports: [DiarioService],
})
export class DiarioModule { }
