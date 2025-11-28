export class ForumAnswerDto {
    idRisposta: string;
    testo: string;
    dataRisposta: Date;
    idPsicologo: string;
}

export class ForumQuestionDto {
    idDomanda: string;
    titolo: string;
    testo: string;
    categoria: string;
    dataInserimento: Date;
    hasResponse?: boolean;
    risposte?: ForumAnswerDto[];
}
