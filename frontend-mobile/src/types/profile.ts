/**
 * Type definitions per l'API Area Personale
 * Endpoint: GET /paziente/area-personale
 */

export interface ProfileDto {
    profilo: {
        nome: string;
        cognome: string;
        immagineProfilo?: string;
    };
    badge: {
        numeroBadge: number;  // Numero totale badge acquisiti
    };
    statoAnimo: {
        umore: string;
        intensita?: number;
        dataInserimento: Date;
        storicoRecente: {
            date: string;       // YYYY-MM-DD
            umore: string;
            intensita?: number;
        }[];
    } | null;  // Null se il paziente non ha mai inserito stati d'animo
    diario: {
        ultimaEntryData: string;      // Formato "dd/MM"
        ultimaEntryTitolo?: string;
        ultimaEntryAnteprima: string;
    } | null;  // Null se il paziente non ha mai scritto nel diario
    questionari: {
        numeroDaCompilare: number;
        messaggioPromemoria?: string;
    };
}
