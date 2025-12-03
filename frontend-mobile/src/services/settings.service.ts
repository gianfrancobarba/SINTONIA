/**
 * Service per la gestione delle impostazioni del paziente
 */

import type { PersonalInfoDto, SupportRequestDto, SupportRequestResponse } from '../types/settings';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Recupera le informazioni personali del paziente autenticato
 * @returns PersonalInfoDto con i dati personali (esclusi dati clinici)
 * @throws Error se il token è mancante o la richiesta fallisce
 */
export const getPersonalInfo = async (): Promise<PersonalInfoDto> => {
    try {
        const token = localStorage.getItem('patient_token');
        if (!token) {
            window.location.href = '/spid-info';
            throw new Error('Missing auth token. Redirecting to login...');
        }

        const response = await fetch(`${API_BASE_URL}/paziente/settings/personal-info`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('patient_token');
            window.location.href = '/spid-info';
            throw new Error('Unauthorized. Redirecting to login...');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching personal info:', error);
        throw error;
    }
};

/**
 * Invia una richiesta di supporto tecnico
 * @param requestData Oggetto contenente titolo e descrizione della richiesta
 * @returns SupportRequestResponse con esito dell'operazione
 * @throws Error se il token è mancante o la richiesta fallisce
 */
export const submitSupportRequest = async (
    requestData: SupportRequestDto
): Promise<SupportRequestResponse> => {
    try {
        const token = localStorage.getItem('patient_token');
        if (!token) {
            window.location.href = '/spid-info';
            throw new Error('Missing auth token. Redirecting to login...');
        }

        const response = await fetch(`${API_BASE_URL}/paziente/settings/support-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestData),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('patient_token');
            window.location.href = '/spid-info';
            throw new Error('Unauthorized. Redirecting to login...');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error submitting support request:', error);
        throw error;
    }
};

/**
 * Aggiorna le informazioni personali del paziente (es. email)
 * @param updates Oggetto con i campi da aggiornare
 * @throws Error se il token è mancante o la richiesta fallisce
 */
export const updatePersonalInfo = async (
    updates: { email?: string }
): Promise<void> => {
    try {
        const token = localStorage.getItem('patient_token');
        if (!token) {
            window.location.href = '/spid-info';
            throw new Error('Missing auth token. Redirecting to login...');
        }

        const response = await fetch(`${API_BASE_URL}/paziente/area-personale/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
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
        console.error('Error updating personal info:', error);
        throw error;
    }
};
