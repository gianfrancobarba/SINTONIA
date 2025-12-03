export class PatientPrioritaDto {
    idPaziente: string;
    prioritaCorrente: 'Urgente' | 'Breve' | 'Differibile' | 'Programmabile';
    score: number | null;
    cambiamentoPriorita: boolean; // True se c'è stato un aumento
}
