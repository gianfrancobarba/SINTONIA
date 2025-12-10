import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AssegnazionePsicologoAmministratoreService } from './assegnazione_psicologo_amministratore.service.js';
import { db } from '../../drizzle/db.js';
import { paziente, psicologo } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import comuniCampania from '../../common/data/comuni-campania.json' with { type: 'json' };

export interface Comune {
    nome: string;
    provincia: string;
    codice: string;
}

@Injectable()
export class Modifica_paziente_amministratoreService {
    private readonly comuni: Comune[] = comuniCampania as unknown as Comune[];

    constructor(
        private readonly assegnazioneService: AssegnazionePsicologoAmministratoreService
    ) { }

    /**
     * Cerca comuni per nome (case-insensitive, partial match)
     */
    searchComuni(query: string): Comune[] {
        const searchTerm = query.toLowerCase().trim();
        if (!searchTerm) {
            return this.comuni;
        }
        return this.comuni.filter(c =>
            c.nome.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Verifica se un comune esiste nella lista
     */
    isValidComune(nome: string): boolean {
        const normalizedName = nome.toLowerCase().trim();
        return this.comuni.some(c =>
            c.nome.toLowerCase() === normalizedName
        );
    }

    /**
     * Aggiorna i campi modificabili di un paziente
     */
    async aggiornaPaziente(
        idPaziente: string,
        updates: {
            email?: string;
            residenza?: string;
            idPsicologo?: string;
        }
    ) {
        // Verifica che il paziente esista
        const existingPatient = await db
            .select()
            .from(paziente)
            .where(eq(paziente.idPaziente, idPaziente))
            .limit(1);

        if (existingPatient.length === 0) {
            throw new NotFoundException(`Paziente con ID ${idPaziente} non trovato`);
        }

        // Validazione Residenza
        if (updates.residenza) {
            // Estrai solo il nome del comune se il formato è "Nome Comune (PROV)"
            // Ma per ora assumiamo che arrivi il nome del comune pulito o che dobbiamo validarlo
            // Se l'input è "Napoli (NA)", la validazione fallirebbe se cerchiamo match esatto su "Napoli"
            // Tuttavia, se il frontend manda il valore selezionato dal dropdown, dovrebbe essere corretto.
            // Facciamo una validazione flessibile: se il comune non è valido, lanciamo errore.

            // Tentativo di pulizia: se c'è una parentesi, prendiamo la parte prima
            let nomeComune = updates.residenza;
            if (updates.residenza.includes('(')) {
                nomeComune = updates.residenza.split('(')[0].trim();
            }

            if (!this.isValidComune(nomeComune)) {
                throw new BadRequestException(`Il comune "${updates.residenza}" non è un comune valido della Campania.`);
            }
        }

        // Aggiorna solo i campi forniti
        const updateData: any = {};
        if (updates.email !== undefined) updateData.email = updates.email;
        if (updates.residenza !== undefined) updateData.residenza = updates.residenza; // Salviamo quello che arriva, assumendo sia corretto dopo validazione

        if (updates.idPsicologo !== undefined) {
            if (!updates.idPsicologo) {
                // Potremmo lanciare un errore o decidere una policy. 
                // Dato che il nuovo service vieta null, se arriva stringa vuota dobbiamo lanciare errore o non chiamare.
                // Ma la specifica UC dice che il service *vieta* null.
                // Quindi se il frontend manda vuoto per "rimuovere", ora questa operazione non è più supportata o deve essere gestita diversamente.
                // Per ora passiamo la stringa (anche se vuota) e lasciamo che il service lanci BadRequest come da test TC_ADM_1_5.
                await this.assegnazioneService.assegnaPsicologo(idPaziente, updates.idPsicologo);
            } else {
                await this.assegnazioneService.assegnaPsicologo(idPaziente, updates.idPsicologo);
            }
        }

        await db
            .update(paziente)
            .set(updateData)
            .where(eq(paziente.idPaziente, idPaziente));

        return { success: true, message: 'Paziente aggiornato con successo' };
    }

    /**
     * Ottiene i dettagli completi di un singolo paziente
     */
    async getDettaglioPaziente(idPaziente: string) {
        const rows = await db
            .select({
                idPaziente: paziente.idPaziente,
                nome: paziente.nome,
                cognome: paziente.cognome,
                email: paziente.email,
                codFiscale: paziente.codFiscale,
                dataNascita: paziente.dataNascita,
                dataIngresso: paziente.dataIngresso,
                residenza: paziente.residenza,
                sesso: paziente.sesso,
                score: paziente.score,
                stato: paziente.stato,
                terms: paziente.terms,
                idPsicologo: paziente.idPsicologo,
                idPriorita: paziente.idPriorita,
                // Informazioni psicologo
                nomePsicologo: psicologo.nome,
                cognomePsicologo: psicologo.cognome,
            })
            .from(paziente)
            .leftJoin(psicologo, eq(paziente.idPsicologo, psicologo.codFiscale))
            .where(eq(paziente.idPaziente, idPaziente))
            .limit(1);

        if (rows.length === 0) {
            throw new NotFoundException(`Paziente con ID ${idPaziente} non trovato`);
        }

        const row = rows[0];
        return {
            idPaziente: row.idPaziente,
            nome: row.nome,
            cognome: row.cognome,
            email: row.email,
            codFiscale: row.codFiscale,
            dataNascita: row.dataNascita,
            dataIngresso: row.dataIngresso,
            residenza: row.residenza,
            sesso: row.sesso,
            score: row.score,
            stato: row.stato,
            terms: row.terms,
            idPsicologo: row.idPsicologo,
            idPriorita: row.idPriorita,
            nomePsicologo: row.nomePsicologo && row.cognomePsicologo
                ? `Dr. ${row.nomePsicologo} ${row.cognomePsicologo}`
                : null,
        };
    }
}
