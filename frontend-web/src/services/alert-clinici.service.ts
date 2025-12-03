import axios from 'axios';
import type { ClinicalAlert } from '../types/alert';

const API_URL = 'http://localhost:3000/psi/clinical-alerts';

// Axios instance with JWT token from localStorage
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.access_token) {
                config.headers.Authorization = `Bearer ${user.access_token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Fetch all clinical alerts that are not yet accepted
 * @returns Array of clinical alerts
 */
export const fetchClinicalAlerts = async (): Promise<ClinicalAlert[]> => {
    try {
        const response = await axiosInstance.get<ClinicalAlert[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching clinical alerts:', error);
        throw error;
    }
};

/**
 * Accept a clinical alert
 * Assigns the alert to the psychologist who accepts it
 * @param id - Alert ID to accept
 */
export const acceptClinicalAlert = async (id: string): Promise<void> => {
    try {
        // Get psychologist's fiscal code from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            throw new Error('Utente non autenticato');
        }

        const user = JSON.parse(userStr);
        const codiceFiscalePsicologo = user.fiscalCode; // Corrected: fiscalCode is the correct key

        if (!codiceFiscalePsicologo) {
            throw new Error('Codice fiscale psicologo non trovato');
        }

        // Call backend endpoint
        await axiosInstance.patch(`${API_URL}/${id}/accept`, {
            codiceFiscalePsicologo
        });

        console.log(`Alert ${id} accettato con successo da ${codiceFiscalePsicologo}`);
    } catch (error) {
        console.error('Errore durante l\'accettazione dell\'alert:', error);
        throw error;
    }
};
