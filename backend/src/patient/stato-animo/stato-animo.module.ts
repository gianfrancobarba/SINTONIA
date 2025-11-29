import { Module } from '@nestjs/common';
import { StatoAnimoController } from './stato-animo.controller.js';
import { StatoAnimoService } from './stato-animo.service.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';

/**
 * Modulo NestJS per la gestione degli stati d'animo del paziente
 * 
 * Registra:
 * - StatoAnimoController: Controller con endpoint GET per ultimo e storico
 * - StatoAnimoService: Service per query al database
 * 
 * Dipendenze:
 * - DrizzleModule: Per accesso al database tramite Drizzle ORM
 * 
 * Esporta:
 * - StatoAnimoService: Utilizzato da AreaPersonaleService per aggregazione dati
 */
@Module({
    imports: [DrizzleModule],
    controllers: [StatoAnimoController],
    providers: [StatoAnimoService],
    exports: [StatoAnimoService],
})
export class StatoAnimoModule { }
