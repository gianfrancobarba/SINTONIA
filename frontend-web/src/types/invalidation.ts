// Invalidation request data type definition
export interface InvalidationRequestData {
    idRichiesta: string;
    idQuestionario: string;
    nomeQuestionario: string;
    idPsicologoRichiedente: string;
    nomePsicologoRichiedente: string;
    stato: 'pending' | 'approved' | 'rejected';
    note: string;
    dataRichiesta: string;
}

export interface InvalidationLoadingState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}
