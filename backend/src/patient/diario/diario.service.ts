import { Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { paginaDiario } from '../../drizzle/schema.js';
import { eq, desc } from 'drizzle-orm';
import { UltimaPaginaDiarioDto } from './dto/ultima-pagina-diario.dto.js';
import { ListaPagineDiarioDto } from './dto/lista-pagine-diario.dto.js';

@Injectable()
export class DiarioService {
    /**
     * Recupera l'ultima pagina del diario inserita dal paziente
     */
    async getUltimaPaginaDiario(userId: string): Promise<UltimaPaginaDiarioDto | null> {
        const rows = await db
            .select({
                idPaginaDiario: paginaDiario.idPaginaDiario,
                titolo: paginaDiario.titolo,
                testo: paginaDiario.testo,
                dataInserimento: paginaDiario.dataInserimento,
            })
            .from(paginaDiario)
            .where(eq(paginaDiario.idPaziente, userId))
            .orderBy(desc(paginaDiario.dataInserimento))
            .limit(1);

        if (rows.length === 0) {
            return null;
        }

        const pagina = rows[0];
        const testoAnteprima = this.createPreview(pagina.testo, 100);
        const dataInserimento = pagina.dataInserimento ? new Date(pagina.dataInserimento) : new Date();
        const dataFormattata = this.formatDisplayDate(dataInserimento);

        return {
            idPaginaDiario: pagina.idPaginaDiario,
            titolo: pagina.titolo,
            testoAnteprima,
            dataInserimento,
            dataFormattata,
        };
    }

    /**
     * Recupera la lista di tutte le pagine del diario del paziente
     */
    async getListaPagineDiario(userId: string, limit: number = 50): Promise<ListaPagineDiarioDto> {
        const rows = await db
            .select({
                idPaginaDiario: paginaDiario.idPaginaDiario,
                titolo: paginaDiario.titolo,
                testo: paginaDiario.testo,
                dataInserimento: paginaDiario.dataInserimento,
            })
            .from(paginaDiario)
            .where(eq(paginaDiario.idPaziente, userId))
            .orderBy(desc(paginaDiario.dataInserimento))
            .limit(limit);

        const pagine = rows.map(pagina => {
            const dataInserimento = pagina.dataInserimento ? new Date(pagina.dataInserimento) : new Date();
            return {
                idPaginaDiario: pagina.idPaginaDiario,
                titolo: pagina.titolo,
                testoAnteprima: this.createPreview(pagina.testo, 100),
                dataInserimento,
                dataFormattata: this.formatDisplayDate(dataInserimento),
            };
        });

        return {
            pagine,
            totale: pagine.length,
        };
    }

    /**
     * Crea un'anteprima del testo limitata a maxLength caratteri
     */
    private createPreview(text: string, maxLength: number): string {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }

    /**
     * Formatta una data in formato dd/MM per visualizzazione (es: "11/10")
     */
    private formatDisplayDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    }
}
