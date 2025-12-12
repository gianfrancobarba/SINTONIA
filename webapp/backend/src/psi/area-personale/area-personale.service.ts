import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { psicologo } from '../../drizzle/schema.js';
import { UpdatePsiProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class AreaPersonaleService {
    async getProfile(codiceFiscale: string) {
        const result = await db
            .select()
            .from(psicologo)
            .where(eq(psicologo.codFiscale, codiceFiscale))
            .limit(1);

        if (!result || result.length === 0) {
            throw new NotFoundException('Psicologo non trovato');
        }

        return result[0];
    }

    async updateProfile(codiceFiscale: string, updateDto: UpdatePsiProfileDto) {
        // Verify existence and get actual psychologist record
        const psychologist = await this.getProfile(codiceFiscale);

        const updateData: any = {};
        if (updateDto.email) updateData.email = updateDto.email;
        if (updateDto.immagineProfilo) updateData.immagineProfilo = updateDto.immagineProfilo;

        // Use the actual codFiscale from the fetched record
        const result = await db
            .update(psicologo)
            .set(updateData)
            .where(eq(psicologo.codFiscale, psychologist.codFiscale))
            .returning();

        return result[0];
    }
}
