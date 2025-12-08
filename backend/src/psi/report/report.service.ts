import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import {
    paziente,
    report,
    statoAnimo,
    questionario,
    paginaDiario,
    domandaForum,
} from '../../drizzle/schema.js';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class ReportService {

    async generateReport(patientId: string, psychologistId: string) {
        // 1. Fetch Patient Data
        const [patientData] = await db
            .select()
            .from(paziente)
            .where(eq(paziente.idPaziente, patientId))
            .limit(1);

        if (!patientData) {
            throw new NotFoundException('Paziente non trovato');
        }

        // 2. Fetch Mood Data (Last 30 entries)
        const moodData = await db
            .select()
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, patientId))
            .orderBy(desc(statoAnimo.dataInserimento))
            .limit(30);

        // 3. Fetch Questionnaires
        const questionnaireData = await db
            .select({
                data: questionario.dataCompilazione,
                score: questionario.score,
                tipo: questionario.nomeTipologia,
                risposte: questionario.risposte,
            })
            .from(questionario)
            .where(eq(questionario.idPaziente, patientId))
            .orderBy(desc(questionario.dataCompilazione));

        // 4. Fetch Diary Entries (Last 10)
        const diaryData = await db
            .select()
            .from(paginaDiario)
            .where(eq(paginaDiario.idPaziente, patientId))
            .orderBy(desc(paginaDiario.dataInserimento))
            .limit(10);

        // 5. Fetch Forum Questions
        const forumData = await db
            .select()
            .from(domandaForum)
            .where(eq(domandaForum.idPaziente, patientId))
            .orderBy(desc(domandaForum.dataInserimento))
            .limit(10);

        // 6. Construct Report Content
        let content = `REPORT CLINICO GENERATO IL ${new Date().toLocaleDateString('it-IT')}\n`;
        content += `==================================================\n\n`;

        content += `1. ANAGRAFICA PAZIENTE\n`;
        content += `----------------------\n`;
        content += `Nome: ${patientData.nome} ${patientData.cognome}\n`;
        content += `Codice Fiscale: ${patientData.codFiscale}\n`;
        content += `Data di Nascita: ${patientData.dataNascita}\n`;
        content += `Residenza: ${patientData.residenza}\n`;
        content += `Score Attuale: ${patientData.score}\n`;
        content += `Priorità: ${patientData.idPriorita}\n\n`;

        content += `2. MONITORAGGIO UMORE (Ultimi 30 inserimenti)\n`;
        content += `---------------------------------------------\n`;
        if (moodData.length === 0) {
            content += `Nessun dato sull'umore registrato.\n`;
        } else {
            moodData.forEach((mood) => {
                const date = mood.dataInserimento
                    ? new Date(mood.dataInserimento).toLocaleDateString('it-IT')
                    : 'N/A';
                content += `- ${date}: ${mood.umore} (Intensità: ${mood.intensita}/10)\n`;
                if (mood.note) content += `  Note: ${mood.note}\n`;
            });
        }
        content += `\n`;

        content += `3. QUESTIONARI CLINICI\n`;
        content += `----------------------\n`;
        if (questionnaireData.length === 0) {
            content += `Nessun questionario compilato.\n`;
        } else {
            questionnaireData.forEach((q) => {
                const date = q.data
                    ? new Date(q.data).toLocaleDateString('it-IT')
                    : 'N/A';
                content += `- [${q.tipo}] del ${date} - Score: ${q.score}\n`;
                // Optional: Add detailed answers if needed, but might be too verbose
            });
        }
        content += `\n`;

        content += `4. DIARIO PERSONALE (Ultime 10 pagine)\n`;
        content += `--------------------------------------\n`;
        if (diaryData.length === 0) {
            content += `Nessuna pagina di diario presente.\n`;
        } else {
            diaryData.forEach((page) => {
                const date = page.dataInserimento
                    ? new Date(page.dataInserimento).toLocaleDateString('it-IT')
                    : 'N/A';
                content += `DATA: ${date}\n`;
                content += `TITOLO: ${page.titolo}\n`;
                content += `TESTO: ${page.testo}\n`;
                content += `-------------------\n`;
            });
        }
        content += `\n`;

        content += `5. ATTIVITÀ FORUM (Ultime 10 domande)\n`;
        content += `-------------------------------------\n`;
        if (forumData.length === 0) {
            content += `Nessuna domanda pubblicata nel forum.\n`;
        } else {
            forumData.forEach((q) => {
                const date = q.dataInserimento
                    ? new Date(q.dataInserimento).toLocaleDateString('it-IT')
                    : 'N/A';
                content += `- ${date} [${q.categoria}]: ${q.titolo}\n`;
                content += `  "${q.testo}"\n`;
            });
        }

        // 7. Save Report to Database
        await db.insert(report).values({
            contenuto: content,
            idPaziente: patientId,
            idPsicologo: psychologistId,
        });

        return { message: 'Report generato con successo', content };
    }
}
