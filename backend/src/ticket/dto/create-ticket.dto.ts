export class CreateTicketDto {
    oggetto: string;
    descrizione: string;
    idPaziente?: string;
    idPsicologo?: string;
    idAmministratore?: string;
}
