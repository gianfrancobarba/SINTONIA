import { IsString } from 'class-validator';

export class AdminDashboardDto {
    @IsString()
    nome: string;

    @IsString()
    cognome: string;
}
