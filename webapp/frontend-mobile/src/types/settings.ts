/**
 * Tipi per la sezione Settings
 */

/**
 * DTO per le informazioni personali del paziente
 */
export interface PersonalInfoDto {
    nome: string;
    cognome: string;
    email: string;
    codFiscale: string;
    dataNascita: string;
    residenza: string;
    sesso: string;
}

/**
 * DTO per la richiesta di supporto tecnico
 */
export interface SupportRequestDto {
    oggetto: string;
    descrizione: string;
}

/**
 * Risposta dal server per richiesta supporto
 */
export interface SupportRequestResponse {
    success: boolean;
    message: string;
}
