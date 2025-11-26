import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { SpidProfileDto } from './dto/spid-profile.dto.js';

@Injectable()
export class SpidAuthService {
    constructor(
        @Inject('drizzle') private db: NodePgDatabase<typeof schema>,
        private jwtService: JwtService,
    ) { }

    async validatePatient(spidProfile: SpidProfileDto) {
        console.log('Validating SPID profile:', spidProfile);

        // 1. Cerca il paziente
        const patients = await this.db
            .select()
            .from(schema.paziente)
            .where(eq(schema.paziente.codFiscale, spidProfile.fiscalNumber));

        if (patients.length > 0) {
            console.log('Patient found:', patients[0].idPaziente);
            return patients[0];
        }

        console.log('Patient not found, creating new one...');

        // 2. Assicurati che esista una priorità (usa 'Breve' come default)
        const priorityName = 'Breve';
        const priorities = await this.db
            .select()
            .from(schema.priorita)
            .where(eq(schema.priorita.nome, priorityName));

        if (priorities.length === 0) {
            await this.db.insert(schema.priorita).values({
                nome: priorityName,
                punteggioInizio: 0,
                punteggioFine: 10,
                finestraTemporale: 30
            });
        }

        // 3. Assicurati che esista uno psicologo (creane uno dummy se necessario)
        const psychologistCod = 'PSICOL01P01H501Z';
        const psychologists = await this.db
            .select()
            .from(schema.psicologo)
            .where(eq(schema.psicologo.codFiscale, psychologistCod));

        if (psychologists.length === 0) {
            await this.db.insert(schema.psicologo).values({
                codFiscale: psychologistCod,
                nome: 'Dottore',
                cognome: 'Default',
                aslAppartenenza: 'ASL001',
                stato: true,
                immagineProfilo: 'default.jpg'
            });
        }

        // 4. Crea il nuovo paziente
        const newPatients = await this.db.insert(schema.paziente).values({
            nome: spidProfile.name,
            cognome: spidProfile.familyName,
            email: spidProfile.email,
            codFiscale: spidProfile.fiscalNumber,
            dataNascita: spidProfile.dateOfBirth,
            sesso: 'M',
            residenza: 'Roma',
            dataIngresso: new Date().toISOString().split('T')[0],
            terms: false,
            idPriorita: priorityName,
            idPsicologo: psychologistCod
        } as any).returning();

        console.log('New patient created:', newPatients[0].idPaziente);
        return newPatients[0];
    }

    async generateToken(patient: any) {
        const payload = {
            sub: patient.idPaziente,
            email: patient.email,
            fiscalCode: patient.codFiscale,
            role: 'patient',
            name: patient.nome,
            familyName: patient.cognome,
        };

        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                id: patient.idPaziente,
                email: patient.email,
                name: patient.nome,
                familyName: patient.cognome,
                role: 'patient',
            },
        };
    }
}
