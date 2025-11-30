import { Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { AreaPersonaleDto } from './dto/area-personale.dto.js';
import { StatoAnimoService } from '../stato-animo/stato-animo.service.js';
import { DiarioService } from '../diario/diario.service.js';
import { BadgeService } from '../badge/badge.service.js';
import { HomeService } from '../home/home.service.js';

@Injectable()
export class AreaPersonaleService {
    constructor(
        private readonly statoAnimoService: StatoAnimoService,
        private readonly diarioService: DiarioService,
        private readonly badgeService: BadgeService,
        private readonly homeService: HomeService,
    ) { }

    /**
     * Recupera tutti i dati aggregati dell'area personale del paziente
     */
    async getAreaPersonale(userId: string): Promise<AreaPersonaleDto> {
        // Recupera dati profilo paziente
        const profiloRows = await db
            .select({
                nome: paziente.nome,
                cognome: paziente.cognome,
            })
            .from(paziente)
            .where(eq(paziente.idPaziente, userId))
            .limit(1);

        const profilo = {
            nome: profiloRows[0]?.nome ?? 'Nome',
            cognome: profiloRows[0]?.cognome ?? 'Cognome',
            immagineProfilo: undefined, // TODO: aggiungere campo immagine profilo se disponibile
        };

        // Recupera dati in parallelo dai vari servizi
        const [badgeData, ultimoStatoAnimo, storicoStatoAnimo, ultimaPaginaDiario, numQuestionari] =
            await Promise.all([
                this.badgeService.getBadgeUtente(userId),
                this.statoAnimoService.getUltimoStatoAnimo(userId),
                this.statoAnimoService.getStoricoStatoAnimo(userId, 7), // Ultimi 7 giorni per grafico
                this.diarioService.getUltimaPaginaDiario(userId),
                this.homeService.getPendingQuestionnairesCount(userId),
            ]);

        // Costruisci oggetto stato d'animo
        const statoAnimo = ultimoStatoAnimo
            ? {
                umore: ultimoStatoAnimo.umore,
                intensita: ultimoStatoAnimo.intensita,
                dataInserimento: ultimoStatoAnimo.dataInserimento,
                storicoRecente: storicoStatoAnimo.entries,
            }
            : null;

        // Costruisci oggetto diario
        const diario = ultimaPaginaDiario
            ? {
                ultimaEntryData: ultimaPaginaDiario.dataFormattata,
                ultimaEntryTitolo: ultimaPaginaDiario.titolo,
                ultimaEntryAnteprima: ultimaPaginaDiario.testoAnteprima,
            }
            : null;

        // Costruisci oggetto questionari
        const questionari = {
            numeroDaCompilare: numQuestionari,
            messaggioPromemoria:
                numQuestionari > 0
                    ? `Hai ${numQuestionari} questionari da completare`
                    : undefined,
        };

        return {
            profilo,
            badge: {
                numeroBadge: badgeData.numeroBadge,  // Solo numero badge, score è dato clinico
            },
            statoAnimo,
            diario,
            questionari,
        };
    }
}
