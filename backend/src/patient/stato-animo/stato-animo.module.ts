import { Module } from '@nestjs/common';
import { StatoAnimoController } from './stato-animo.controller.js';
import { StatoAnimoService } from './stato-animo.service.js';
import { CreateStatoAnimoController } from './create-stato-animo.controller.js';
import { CreateStatoAnimoService } from './create-stato-animo.service.js';
import { UpdateStatoAnimoController } from './update-stato-animo.controller.js';
import { UpdateStatoAnimoService } from './update-stato-animo.service.js';
import { DeleteStatoAnimoController } from './delete-stato-animo.controller.js';
import { DeleteStatoAnimoService } from './delete-stato-animo.service.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';
import { BadgeModule } from '../badge/badge.module.js';

/**
 * Modulo NestJS per la gestione degli stati d'animo del paziente
 * 
 * Registra:
 * - StatoAnimoController: Controller con endpoint GET per ultimo e storico
 * - StatoAnimoService: Service per query al database
 * - CreateStatoAnimoController: Controller con endpoint POST per creazione
 * - CreateStatoAnimoService: Service per inserimento nuovi stati d'animo
 * - UpdateStatoAnimoController: Controller con endpoint PATCH per modifica
 * - UpdateStatoAnimoService: Service per aggiornamento stati d'animo esistenti
 * - DeleteStatoAnimoController: Controller con endpoint DELETE per eliminazione
 * - DeleteStatoAnimoService: Service per eliminazione stati d'animo
 * 
 * Dipendenze:
 * - DrizzleModule: Per accesso al database tramite Drizzle ORM
 * 
 * Esporta:
 * - StatoAnimoService: Utilizzato da AreaPersonaleService per aggregazione dati
 */
@Module({
    imports: [DrizzleModule, BadgeModule],
    controllers: [
        StatoAnimoController,
        CreateStatoAnimoController,
        UpdateStatoAnimoController,
        DeleteStatoAnimoController,
    ],
    providers: [
        StatoAnimoService,
        CreateStatoAnimoService,
        UpdateStatoAnimoService,
        DeleteStatoAnimoService,
    ],
    exports: [StatoAnimoService],
})
export class StatoAnimoModule { }
