/**
 * DTO for questionnaire response
 * Includes data from both questionario and tipologia_questionario tables
 */
export class QuestionnaireResponseDto {
    idQuestionario: string;
    idPaziente: string;
    nomeTipologia: string;
    score: number | null;
    risposte: any; // Patient answers as JSON
    campi: string[]; // Array of field options from tipologia_questionario
    cambiamento: boolean;
    dataCompilazione: string;
    revisionato: boolean;
    invalidato: boolean;
    noteInvalidazione: string | null;
    dataInvalidazione: string | null;
    idPsicologoRevisione: string | null;
    idPsicologoRichiedente: string | null;
    idAmministratoreConferma: string | null;
    domande: string[]; // Array of questions from tipologia_questionario
}
