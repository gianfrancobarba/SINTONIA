import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class TermsService {
    constructor(
        @Inject('drizzle') private db: NodePgDatabase<typeof schema>,
    ) { }

    async acceptTerms(patientId: string) {
        const result = await this.db
            .update(schema.paziente)
            .set({ terms: true })
            .where(eq(schema.paziente.idPaziente, patientId))
            .returning();

        return result[0];
    }
}
