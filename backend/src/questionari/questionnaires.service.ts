import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../drizzle/db.js';
import { questionario, tipologiaQuestionario } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { QuestionnaireResponseDto } from './dto/questionnaire-response.dto.js';

@Injectable()
export class QuestionnairesService {
    /**
     * Get single questionnaire by ID with tipologia data
     * @param id - UUID of the questionnaire
     * @returns QuestionnaireResponseDto with campi and domande from tipologia_questionario
     */
    async getQuestionnaireById(id: string): Promise<QuestionnaireResponseDto> {
        // Query with JOIN to tipologia_questionario
        const result = await db.query.questionario.findFirst({
            where: eq(questionario.idQuestionario, id),
            with: {
                // This assumes you have a relation defined in schema
                // If not, we'll use a manual join below
            }
        });

        if (!result) {
            throw new NotFoundException(`Questionario con ID ${id} non trovato`);
        }

        // Get tipologia data separately
        const tipologia = await db.query.tipologiaQuestionario.findFirst({
            where: eq(tipologiaQuestionario.nome, result.nomeTipologia),
        });

        if (!tipologia) {
            throw new NotFoundException(`Tipologia questionario ${result.nomeTipologia} non trovata`);
        }

        // Parse domande and campi from JSON/string to arrays
        const parseDomandeOCampi = (data: any): string[] => {
            if (!data) return [];

            // If it's already an array, return it
            if (Array.isArray(data)) return data;

            // If it's a string with semicolons, split it
            if (typeof data === 'string') {
                return data.split(';').map(item => item.trim()).filter(item => item.length > 0);
            }

            // If it's an object, try to extract values or convert to string
            return [String(data)];
        };

        // Map database result to DTO
        return {
            idQuestionario: result.idQuestionario,
            idPaziente: result.idPaziente,
            nomeTipologia: result.nomeTipologia,
            score: result.score,
            risposte: result.risposte, // Include patient answers
            campi: parseDomandeOCampi(tipologia.campi), // Parse campi to array
            cambiamento: result.cambiamento ?? false,
            dataCompilazione: result.dataCompilazione.toISOString(),
            revisionato: result.revisionato ?? false,
            invalidato: result.invalidato ?? false,
            noteInvalidazione: result.noteInvalidazione,
            dataInvalidazione: result.dataInvalidazione?.toISOString() ?? null,
            idPsicologoRevisione: result.idPsicologoRevisione,
            idPsicologoRichiedente: result.idPsicologoRichiedente,
            idAmministratoreConferma: result.idAmministratoreConferma,
            domande: parseDomandeOCampi(tipologia.domande), // Parse domande to array
        };
    }
}
