/**
 * DTO aggregato per l'area personale del paziente
 * Utilizzato dall'endpoint GET /paziente/area-personale
 * 
 * Combina tutti i dati necessari per visualizzare l'area personale:
 * - Informazioni profilo paziente
 * - Badge acquisiti (SENZA score clinico!)
 * - Ultimo stato d'animo con storico recente
 * - Ultima entry del diario
 * - Questionari da compilare
 */
export class AreaPersonaleDto {
    profilo: {
        nome: string;              // Nome del paziente
        cognome: string;           // Cognome del paziente
        immagineProfilo?: string;  // URL immagine profilo (futuro)
    };

    badge: {
        numeroBadge: number;  // Numero totale badge acquisiti (es: 1) - NO SCORE!
    };

    statoAnimo: {
        umore: string;              // Tipo umore dell'ultimo stato d'animo
        intensita?: number;         // Intensità 1-10
        dataInserimento: Date;      // Data inserimento
        storicoRecente: {           // Ultimi 7 giorni di stati d'animo per grafico
            date: string;           // Data formato YYYY-MM-DD  
            umore: string;          // Umore del giorno
        }[];
    } | null;  // Null se il paziente non ha mai inserito stati d'animo

    diario: {
        ultimaEntryData: string;      // Data formattata "dd/MM" (es: "11/10")
        ultimaEntryTitolo?: string;   // Titolo ultima pagina
        ultimaEntryAnteprima: string; // Anteprima testo
    } | null;  // Null se il paziente non ha mai scritto nel diario

    questionari: {
        numeroDaCompilare: number;     // Quanti questionari deve ancora compilare
        messaggioPromemoria?: string;  // Messaggio promemoria (es: "Hai 2 questionari da completare")
    };
}
