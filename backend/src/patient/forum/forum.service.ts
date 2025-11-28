import { Inject, Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { domandaForum, rispostaForum } from '../../drizzle/schema.js';
import { eq, not } from 'drizzle-orm';
import { ForumQuestionDto } from '../../forum-comune/dto/forum.dto.js';

type DrizzleDB = typeof db;

@Injectable()
export class ForumService {
    constructor(@Inject('drizzle') private db: DrizzleDB) { }

    async getMyQuestions(patientId: string) {
        // Ritorna le domande che il paziente ha pubblicato
        const rows = await this.db
            .select()
            .from(domandaForum)
            .leftJoin(rispostaForum, eq(domandaForum.idDomanda, rispostaForum.idDomanda))
            .where(eq(domandaForum.idPaziente, patientId));

        return this.groupQuestions(rows);
    }

    async getPublicQuestions(patientId: string) {
        // Ritorna domande pubbliche che hanno almeno una risposta
        const rows = await this.db
            .select()
            .from(domandaForum)
            .leftJoin(rispostaForum, eq(domandaForum.idDomanda, rispostaForum.idDomanda))
            .where(not(eq(domandaForum.idPaziente, patientId)));

        const grouped = this.groupQuestions(rows);
        // Filtriamo solo quelle che hanno risposte
        return grouped.filter(q => q.risposte && q.risposte.length > 0);
    }

    private groupQuestions(rows: any[]): ForumQuestionDto[] {
        const map = new Map<string, ForumQuestionDto>();

        for (const row of rows) {
            const q = row.domanda_forum;
            const a = row.risposta_forum;

            if (!map.has(q.idDomanda)) {
                map.set(q.idDomanda, {
                    ...q,
                    risposte: [],
                });
            }

            if (a) {
                const question = map.get(q.idDomanda);
                if (question && question.risposte) {
                    question.risposte.push(a);
                }
            }
        }

        return Array.from(map.values());
    }
}
