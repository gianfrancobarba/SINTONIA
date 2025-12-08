// Notification types matching backend
export interface NotificationDto {
    idNotifica: string;
    titolo: string;
    tipologia: string | null;
    descrizione: string;
    dataInvio: string | null;
    letto: boolean;
}

export interface PaginatedNotificationsDto {
    notifications: NotificationDto[];
    total: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}

export interface NotificationCountDto {
    count: number;
}

const API_URL = 'http://localhost:3000/paziente/notifiche';

const getAuthHeaders = () => {
    const token = localStorage.getItem('patient_token');
    if (!token) {
        window.location.href = '/spid-info';
        throw new Error('Missing auth token. Redirecting to login...');
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

/**
 * Fetch paginated notifications for the current patient
 * Patient ID is extracted from JWT token on backend
 */
export const getNotifications = async (page: number = 1): Promise<PaginatedNotificationsDto> => {
    try {
        const response = await fetch(`${API_URL}?page=${page}`, getAuthHeaders());

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('patient_token');
            window.location.href = '/spid-info';
            throw new Error('Unauthorized. Redirecting to login...');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

/**
 * Get unread notifications count for the current patient
 * Patient ID is extracted from JWT token on backend
 */
export const getUnreadCount = async (): Promise<NotificationCountDto> => {
    try {
        const response = await fetch(`${API_URL}/count`, getAuthHeaders());

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('patient_token');
            window.location.href = '/spid-info';
            throw new Error('Unauthorized. Redirecting to login...');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching unread count:', error);
        throw error;
    }
};

/**
 * Mark a single notification as read
 */
export const markAsRead = async (idNotifica: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/${idNotifica}/read`, {
            method: 'PATCH',
            ...getAuthHeaders(),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('patient_token');
            window.location.href = '/spid-info';
            throw new Error('Unauthorized. Redirecting to login...');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

/**
 * Mark all notifications as read for the current patient
 * Patient ID is extracted from JWT token on backend
 */
export const markAllAsRead = async (): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/read-all`, {
            method: 'PATCH',
            ...getAuthHeaders(),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('patient_token');
            window.location.href = '/spid-info';
            throw new Error('Unauthorized. Redirecting to login...');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
};
