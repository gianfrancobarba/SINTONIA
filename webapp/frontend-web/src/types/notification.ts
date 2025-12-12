export interface Notification {
    idNotifica: string;
    titolo: string;
    tipologia: string | null;
    descrizione: string;
    dataInvio: string | null;
    letto: boolean;
}

export interface NotificationCount {
    count: number;
}

export interface PaginatedNotifications {
    notifications: Notification[];
    total: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}

