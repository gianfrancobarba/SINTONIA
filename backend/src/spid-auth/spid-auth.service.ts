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

        // 3. (Rimosso) Non assegniamo più uno psicologo di default

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
            idPsicologo: null
        } as any).returning();

        console.log('New patient created:', newPatients[0].idPaziente);
        return newPatients[0];
    }

    async validatePsychologist(spidProfile: SpidProfileDto) {
        console.log('Validating SPID profile for Psychologist:', spidProfile);

        const psychologists = await this.db
            .select()
            .from(schema.psicologo)
            .where(eq(schema.psicologo.codFiscale, spidProfile.fiscalNumber));

        if (psychologists.length > 0) {
            console.log('Psychologist found:', psychologists[0].codFiscale);
            return psychologists[0];
        }

        console.log('Psychologist not found, creating new one...');

        // Create new psychologist
        const newPsychologists = await this.db.insert(schema.psicologo).values({
            codFiscale: spidProfile.fiscalNumber,
            nome: spidProfile.name,
            cognome: spidProfile.familyName,
            aslAppartenenza: 'ASL001', // Default ASL
            stato: true,
            immagineProfilo: 'default-profile.jpg'
        }).returning();

        console.log('New psychologist created:', newPsychologists[0].codFiscale);
        return newPsychologists[0];
    }

    async generateToken(user: any, role: 'patient' | 'psychologist' = 'patient') {
        const payload = {
            sub: role === 'patient' ? user.idPaziente : user.codFiscale,
            email: user.email || user.codFiscale, // Psicologo might not have email in schema
            fiscalCode: user.codFiscale,
            role: role,
            name: user.nome,
            familyName: user.cognome,
            terms: user.terms,
        };

        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                id: role === 'patient' ? user.idPaziente : user.codFiscale,
                email: user.email || user.codFiscale,
                name: user.nome,
                familyName: user.cognome,
                role: role,
                terms: user.terms,
            },
        };
    }
}
