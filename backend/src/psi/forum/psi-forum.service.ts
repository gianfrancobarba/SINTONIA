import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { domandaForum, rispostaForum, psicologo } from '../../drizzle/schema.js';
import { eq, not, exists, and } from 'drizzle-orm';
import { ForumQuestionDto } from '../../forum-comune/dto/forum.dto.js';
import { NotificationHelperService } from '../../notifications/notification-helper.service.js';

type DrizzleDB = typeof db;

@Injectable()
export class PsiForumService {
    constructor(
        @Inject('drizzle') private db: DrizzleDB,
        private readonly notificationHelper: NotificationHelperService,
    ) { }

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

    async getMyAnswers(psiId: string, categoria?: string) {
        // 1. Trova ID domande dove ho risposto
        const myAnsweredQuestionIdsQuery = this.db
            .selectDistinct({ idDomanda: domandaForum.idDomanda })
            .from(domandaForum)
            .innerJoin(rispostaForum, eq(domandaForum.idDomanda, rispostaForum.idDomanda))
            .where(eq(rispostaForum.idPsicologo, psiId));

        if (categoria) {
            // Nota: where() sovrascrive, quindi usiamo and() se ci sono già condizioni, ma qui è catena.
            // Drizzle query builder è immutabile o no? Check.
            // Meglio costruire la condizione where completa.
            // Ma selectDistinct...where...
            // Facciamo così:
        }

        // Riscriviamo per chiarezza e correttezza con filtro dinamico
        const conditions = [eq(rispostaForum.idPsicologo, psiId)];
        if (categoria) {
            conditions.push(eq(domandaForum.categoria, categoria));
        }

        const myAnsweredQuestionIds = await this.db
            .selectDistinct({ idDomanda: domandaForum.idDomanda })
            .from(domandaForum)
            .innerJoin(rispostaForum, eq(domandaForum.idDomanda, rispostaForum.idDomanda))
            .where(and(...conditions));

        if (myAnsweredQuestionIds.length === 0) {
            return [];
        }

        // 2. Recupera domande e tutte le risposte per quegli ID
        // Anche qui applichiamo il filtro categoria se presente (ridondante ma sicuro)
        const mainConditions: any[] = [
            exists(
                this.db
                    .select()
                    .from(rispostaForum)
                    .where(
                        and(
                            eq(rispostaForum.idDomanda, domandaForum.idDomanda),
                            eq(rispostaForum.idPsicologo, psiId)
                        )
                    )
            )
        ];

        if (categoria) {
            mainConditions.push(eq(domandaForum.categoria, categoria));
        }

        const rows = await this.db
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
            .leftJoin(psicologo, eq(rispostaForum.idPsicologo, psicologo.codFiscale))
            .where(and(...mainConditions));

        return this.groupQuestions(rows);
    }

    async getUnansweredQuestions(categoria?: string) {
        const conditions: any[] = [
            not(
                exists(
                    this.db
                        .select()
                        .from(rispostaForum)
                        .where(eq(rispostaForum.idDomanda, domandaForum.idDomanda)),
                ),
            )
        ];

        if (categoria) {
            conditions.push(eq(domandaForum.categoria, categoria));
        }

        const rows = await this.db
            .select({
                domanda: domandaForum,
                risposta: rispostaForum, // Sarà null
                psicologo: { // Sarà null
                    nome: psicologo.nome,
                    cognome: psicologo.cognome,
                }
            })
            .from(domandaForum)
            .leftJoin(rispostaForum, eq(domandaForum.idDomanda, rispostaForum.idDomanda))
            .leftJoin(psicologo, eq(rispostaForum.idPsicologo, psicologo.codFiscale)) // Join inutile ma per coerenza di struttura
            .where(and(...conditions));

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
                        idPsicologo: a.idPsicologo,
                        nomePsicologo: p?.nome || 'Sconosciuto',
                        cognomePsicologo: p?.cognome || '',
                    });
                }
            }
        }

        return Array.from(map.values());
    }

    async createAnswer(psiId: string, questionId: string, text: string) {
        // 1. Recupera la domanda per ottenere il paziente autore
        const question = await db.query.domandaForum.findFirst({
            where: eq(domandaForum.idDomanda, questionId)
        });

        // 2. Inserisce la risposta
        const [newAnswer] = await this.db.insert(rispostaForum).values({
            testo: text,
            idPsicologo: psiId,
            idDomanda: questionId,
        }).returning();

        // 3. Notifica il paziente che ha posto la domanda
        if (question?.idPaziente) {
            await this.notificationHelper.notifyPaziente(
                question.idPaziente,
                'Nuova risposta alla tua domanda',
                `Uno psicologo ha risposto alla tua domanda: "${question.titolo}"`,
                'FORUM',
            );
        }

        return newAnswer;
    }

    async updateAnswer(psiId: string, answerId: string, text: string) {
        const [updatedAnswer] = await this.db.update(rispostaForum)
            .set({ testo: text })
            .where(and(
                eq(rispostaForum.idRisposta, answerId),
                eq(rispostaForum.idPsicologo, psiId)
            ))
            .returning();

        if (!updatedAnswer) {
            throw new NotFoundException('Risposta non trovata o non autorizzato');
        }
        return updatedAnswer;
    }

    async deleteAnswer(psiId: string, answerId: string) {
        const [deletedAnswer] = await this.db.delete(rispostaForum)
            .where(and(
                eq(rispostaForum.idRisposta, answerId),
                eq(rispostaForum.idPsicologo, psiId)
            ))
            .returning();

        if (!deletedAnswer) {
            throw new NotFoundException('Risposta non trovata o non autorizzato');
        }
        return deletedAnswer;
    }
}
