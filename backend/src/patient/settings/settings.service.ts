import { Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paziente, ticket } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { PersonalInfoDto } from './dto/personal-info.dto.js';
import { SupportRequestDto } from './dto/support-request.dto.js';

@Injectable()
export class SettingsService {
    /**
     * Recupera le informazioni personali del paziente
     * Esclusi dati clinici: score, priorità, idPsicologo, dataIngresso
     */
    async getPersonalInfo(userId: string): Promise<PersonalInfoDto> {
        const result = await db
            .select({
                nome: paziente.nome,
                cognome: paziente.cognome,
                email: paziente.email,
                codFiscale: paziente.codFiscale,
                dataNascita: paziente.dataNascita,
                residenza: paziente.residenza,
                sesso: paziente.sesso,
            })
            .from(paziente)
            .where(eq(paziente.idPaziente, userId))
            .limit(1);

        if (!result || result.length === 0) {
            throw new Error('Paziente non trovato');
        }

        return {
            nome: result[0].nome,
            cognome: result[0].cognome,
            email: result[0].email,
            codFiscale: result[0].codFiscale,
            dataNascita: result[0].dataNascita,
            residenza: result[0].residenza,
            sesso: result[0].sesso,
        };
    }

    /**
     * Crea una nuova richiesta di supporto tecnico
     * Inserisce un ticket nel database con stato "Aperto"
     */
    async createSupportRequest(
        userId: string,
        data: SupportRequestDto,
    ): Promise<{ success: boolean; message: string }> {
        try {
            await db.insert(ticket).values({
                oggetto: data.oggetto,
                descrizione: data.descrizione,
                risolto: 'Aperto',
                idPaziente: userId,
                idAmministratore: null,
                idPsicologo: null,
            });

            return {
                success: true,
                message: 'Richiesta di supporto inviata con successo',
            };
        } catch (error) {
            console.error('Errore creazione ticket supporto:', error);
            throw new Error('Errore durante la creazione della richiesta di supporto');
        }
    }
}
