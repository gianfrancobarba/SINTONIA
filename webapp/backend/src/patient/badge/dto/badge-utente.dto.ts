/**
 * DTO per i badge acquisiti dal paziente
 * Utilizzato dall'endpoint GET /paziente/badge/lista
 * 
 * Restituisce SOLO il numero totale di badge e la lista dei badge.
 * NOTA IMPORTANTE: Il campo 'score' della tabella paziente NON viene mai esposto
 * perché è un dato clinico interno usato solo per il calcolo della priorità nella lista d'attesa.
 */
export class BadgeUtenteDto {
    numeroBadge: number;  // Numero totale badge acquisiti dal paziente (mostrato nella card "I Tuoi Badge")
    badges: {
        nome: string;             // Nome del badge (es: "Voce Attiva")
        descrizione: string;      // Descrizione del badge
        immagineBadge?: string;   // Path immagine badge (opzionale)
        dataAcquisizione?: Date;   // Quando il paziente ha ottenuto il badge (undefined se non acquisito)
    }[];
}
