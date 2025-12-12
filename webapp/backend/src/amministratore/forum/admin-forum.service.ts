import { Inject, Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { domandaForum, rispostaForum, psicologo } from '../../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';
import { ForumQuestionDto } from '../../forum-comune/dto/forum.dto.js';

type DrizzleDB = typeof db;

@Injectable()
export class AdminForumService {
    constructor(@Inject('drizzle') private db: DrizzleDB) { }

    async getAllQuestions(categoria?: string) {
        let query = this.db
            .select({
                domanda: domandaForum,
                risposta: rispostaForum,
                psicologo: {
                    nome: psicologo.nome,
                    cognome: psicologo.cognome,
                }
            })
            .from(domandaForum)
            .leftJoin(rispostaForum, eq(domandaForum.idDomanda, rispostaForum.idDomanda))
            .leftJoin(psicologo, eq(rispostaForum.idPsicologo, psicologo.codFiscale));

        if (categoria) {
            query.where(eq(domandaForum.categoria, categoria));
        }

        const rows = await query;
        return this.groupQuestions(rows);
    }

    private groupQuestions(rows: any[]): ForumQuestionDto[] {
        const map = new Map<string, ForumQuestionDto>();

        for (const row of rows) {
            const q = row.domanda;
            const a = row.risposta;
            const p = row.psicologo;

            if (!map.has(q.idDomanda)) {
                map.set(q.idDomanda, {
                    ...q,
                    risposte: [],
                });
            }

            if (a) {
                const question = map.get(q.idDomanda);
                if (question && question.risposte) {
                    question.risposte.push({
                        ...a,
                        nomePsicologo: p?.nome || 'Sconosciuto',
                        cognomePsicologo: p?.cognome || '',
                    });
                }
            }
        }

        return Array.from(map.values());
    }
}
