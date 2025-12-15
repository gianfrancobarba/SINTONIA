import { Module } from '@nestjs/common';
import { ForumService } from './forum.service.js';
import { ForumController } from './forum.controller.js';
import { DrizzleModule } from '../../drizzle/drizzle.module.js';
import { InserimentoDomandaController } from './inserimento_domanda.controller.js';
import { ModificaDomandaController } from './modifica_domanda.controller.js';
import { EliminazioneDomandaController } from './eliminazione_domanda.controller.js';
import { InserimentoDomandaService } from './inserimento_domanda.service.js';
import { ModificaDomandaService } from './modifica_domanda.service.js';
import { EliminazioneDomandaService } from './eliminazione_domanda.service.js';
import { BadgeModule } from '../badge/badge.module.js';

@Module({
    imports: [DrizzleModule, BadgeModule],
    controllers: [
        ForumController,
        InserimentoDomandaController,
        ModificaDomandaController,
        EliminazioneDomandaController
    ],
    providers: [
        ForumService,
        InserimentoDomandaService,
        ModificaDomandaService,
        EliminazioneDomandaService
    ],
    exports: [
        ForumService,
        InserimentoDomandaService,
        ModificaDomandaService,
        EliminazioneDomandaService
    ],
})
export class ForumModule { }
