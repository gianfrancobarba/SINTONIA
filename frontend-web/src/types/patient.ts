// Patient data type definition
export interface PatientData {
    idPaziente: string;
    nome: string;
    cognome: string;
    email: string;
    dataNascita: string;
    dataIngresso: string;
    idPsicologo: string | null;
    nomePsicologo?: string; // Nome completo dello psicologo assegnato
    score: number | null;
}

export interface LoadingState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}
