import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { amministratore } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { AdminDashboardDto } from '../dto/AS-dashboard.dto.js';

@Injectable()
export class DashboardService {
    async getDashboardData(email: string): Promise<AdminDashboardDto> {
        // Fetch Admin Info
        const admin = await db.query.amministratore.findFirst({
            where: eq(amministratore.email, email),
        });

        if (!admin) {
            throw new NotFoundException('Amministratore non trovato');
        }

        // Return only admin data
        return {
            nome: admin.nome,
            cognome: admin.cognome,
        };
    }
}
