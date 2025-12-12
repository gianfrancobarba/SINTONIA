export class AdminNotificationResponseDto {
    idNotifica: string;
    titolo: string;
    tipologia: string | null;
    descrizione: string;
    dataInvio: Date | null;
    letto: boolean;
}

export class AdminNotificationCountDto {
    count: number;
}

export class AdminPaginatedNotificationsDto {
    notifications: AdminNotificationResponseDto[];
    total: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}

