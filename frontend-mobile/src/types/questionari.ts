export interface QuestionarioItemDto {
    id: string;
    titolo: string;
    descrizione: string;
    scadenza?: string;
    dataCompletamento?: string;
}

export interface StoricoQuestionariDto {
    daCompilare: QuestionarioItemDto[];
    completati: QuestionarioItemDto[];
    totalCompletati?: number;
    currentPage?: number;
    totalPages?: number;
}
