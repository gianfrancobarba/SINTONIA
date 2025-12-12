import { getCurrentUser } from './auth.service';
import type { Notification, NotificationCount, PaginatedNotifications } from '../types/notification';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Recupera le notifiche paginate per lo psicologo
 */
export async function fetchPsychologistNotifications(codiceFiscale: string, page: number = 1): Promise<PaginatedNotifications> {
    const user = getCurrentUser();
    const token = user?.access_token;

    const response = await fetch(
        `${API_BASE_URL}/psi/notifiche?cf=${encodeURIComponent(codiceFiscale)}&page=${page}`,
        {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Errore nel recupero delle notifiche');
    }

    return response.json();
}

/**
 * Recupera il conteggio notifiche non lette per lo psicologo
 */
export async function fetchPsychologistNotificationCount(codiceFiscale: string): Promise<NotificationCount> {
    const user = getCurrentUser();
    const token = user?.access_token;

    const response = await fetch(
        `${API_BASE_URL}/psi/notifiche/count?cf=${encodeURIComponent(codiceFiscale)}`,
        {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Errore nel recupero del conteggio notifiche');
    }

    return response.json();
}

/**
 * Segna una notifica come letta (psicologo)
 */
export async function markPsychologistNotificationAsRead(idNotifica: string): Promise<void> {
    const user = getCurrentUser();
    const token = user?.access_token;

    const response = await fetch(
        `${API_BASE_URL}/psi/notifiche/${idNotifica}/read`,
        {
            method: 'PATCH',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Errore nel segnare la notifica come letta');
    }
}

/**
 * Segna tutte le notifiche come lette (psicologo)
 */
export async function markAllPsychologistNotificationsAsRead(codiceFiscale: string): Promise<void> {
    const user = getCurrentUser();
    const token = user?.access_token;

    const response = await fetch(
        `${API_BASE_URL}/psi/notifiche/read-all?cf=${encodeURIComponent(codiceFiscale)}`,
        {
            method: 'PATCH',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Errore nel segnare tutte le notifiche come lette');
    }
}

/**
 * Recupera le notifiche paginate per l'amministratore
 */
export async function fetchAdminNotifications(email: string, page: number = 1): Promise<PaginatedNotifications> {
    const user = getCurrentUser();
    const token = user?.access_token;

    const response = await fetch(
        `${API_BASE_URL}/admin/notifiche?email=${encodeURIComponent(email)}&page=${page}`,
        {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Errore nel recupero delle notifiche');
    }

    return response.json();
}

/**
 * Recupera il conteggio notifiche non lette per l'amministratore
 */
export async function fetchAdminNotificationCount(email: string): Promise<NotificationCount> {
    const user = getCurrentUser();
    const token = user?.access_token;

    const response = await fetch(
        `${API_BASE_URL}/admin/notifiche/count?email=${encodeURIComponent(email)}`,
        {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Errore nel recupero del conteggio notifiche');
    }

    return response.json();
}

/**
 * Segna una notifica come letta (admin)
 */
export async function markAdminNotificationAsRead(idNotifica: string): Promise<void> {
    const user = getCurrentUser();
    const token = user?.access_token;

    const response = await fetch(
        `${API_BASE_URL}/admin/notifiche/${idNotifica}/read`,
        {
            method: 'PATCH',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Errore nel segnare la notifica come letta');
    }
}

/**
 * Segna tutte le notifiche come lette (admin)
 */
export async function markAllAdminNotificationsAsRead(email: string): Promise<void> {
    const user = getCurrentUser();
    const token = user?.access_token;

    const response = await fetch(
        `${API_BASE_URL}/admin/notifiche/read-all?email=${encodeURIComponent(email)}`,
        {
            method: 'PATCH',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        throw new Error('Errore nel segnare tutte le notifiche come lette');
    }
}
