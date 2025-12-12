export class NotificationResponseDto {
    idNotifica: string;
    titolo: string;
    tipologia: string | null;
    descrizione: string;
    dataInvio: Date | null;
    letto: boolean;
    isDynamic: boolean;
}

export class NotificationCountDto {
    count: number;
}

export class PaginatedNotificationsDto {
    notifications: NotificationResponseDto[];
    total: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}
