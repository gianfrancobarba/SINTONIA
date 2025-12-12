// Type definitions for Questionario (Questionnaire) feature

export interface Domanda {
    id: string;
    testo: string;
    tipo: 'scala' | 'testo' | 'multipla';
    scalaMin?: number;
    scalaMax?: number;
    opzioni?: string[];
}

export interface Risposta {
    idDomanda: string;
    valore: number | string;
}

export interface GetQuestionarioDto {
    idQuestionario: string;
    nomeTipologia: string;
    tempoSomministrazione: number;
    domande: Domanda[];
}

export interface SubmitQuestionarioDto {
    risposte: Risposta[];
}

export interface QuestionarioResultDto {
    success: boolean;
    idQuestionario: string;
    score?: number;
    cambiamento?: boolean;
    message: string;
}
