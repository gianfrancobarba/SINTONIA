/**
 * DTO per le informazioni personali del paziente
 * Contiene solo dati personali visibili all'utente,
 * esclusi dati clinici (score, priorità, idPsicologo, dataIngresso)
 */
export class PersonalInfoDto {
    nome: string;
    cognome: string;
    email: string;
    codFiscale: string;
    dataNascita: string;
    residenza: string;
    sesso: string;
}
