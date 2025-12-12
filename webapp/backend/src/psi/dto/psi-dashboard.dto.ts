/**
 * DTO per la risposta dell'endpoint dashboard sidebar dello psicologo
 * Contiene dati profilo e contatori per badge di notifica
 */
export class PsiDashboardResponseDto {
    /**
     * Nome completo dello psicologo (es. "Dott. Mario Rossi")
     */
    fullName: string;

    /**
     * URL immagine profilo
     */
    profileImageUrl: string;

    /**
     * Ruolo/Specializzazione dello psicologo
     */
    role: string;

    /**
     * Numero di alert clinici non accettati
     */
    alertsCount: number;

    /**
     * Numero di questionari in attesa di revisione
     */
    pendingQuestionnairesCount: number;

    /**
     * Numero di domande forum senza risposta
     */
    unreadMessagesCount: number;
}
