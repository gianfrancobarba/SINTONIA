import axios from 'axios';
import type { PatientData } from '../types/patient';
import { getCurrentUser } from './auth.service';

const API_URL = 'http://localhost:3000';

/**
 * Fetch all patients (admin only)
 */
export const fetchPatients = async (): Promise<PatientData[]> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const response = await axios.get(`${API_URL}/admin/patients`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
};

/**
 * Cerca un paziente specifico per ID (admin only)
 * @param id - UUID del paziente da cercare
 * @returns Dati del paziente trovato
 */
export const searchPatientById = async (id: string): Promise<PatientData> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const response = await axios.get(`${API_URL}/admin/patients/search/${id}`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching patient:', error);
        throw error;
    }
};

/**
 * Get detailed patient information (admin only)
 * @param id - UUID del paziente
 */
export const getPatientDetails = async (id: string): Promise<any> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const response = await axios.get(`${API_URL}/admin/patients/${id}`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching patient details:', error);
        throw error;
    }
};

/**
 * Update patient information (admin only)
 * @param id - UUID del paziente
 * @param updates - Campi da aggiornare
 */
export const updatePatient = async (
    id: string,
    updates: {
        email?: string;
        residenza?: string;
        idPsicologo?: string;
    }
): Promise<any> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const response = await axios.patch(`${API_URL}/admin/patients/${id}`, updates, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating patient:', error);
        throw error;
    }
};

/**
 * Fetch patients for a specific psychologist
 */
export const fetchPatientsByPsychologist = async (): Promise<PatientData[]> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const cf = getCurrentUser()?.fiscalCode || getCurrentUser()?.email;

        const response = await axios.get(`${API_URL}/psi/patients?cf=${cf}`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching psychologist patients:', error);
        throw error;
    }
};

/**
 * Cerca un paziente specifico per ID (psicologo - solo suoi pazienti)
 * @param id - UUID del paziente da cercare
 * @returns Dati del paziente trovato
 */
export const searchPatientByIdForPsychologist = async (id: string): Promise<PatientData> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const cf = getCurrentUser()?.fiscalCode || getCurrentUser()?.email;

        const response = await axios.get(`${API_URL}/psi/patients/search/${id}?cf=${cf}`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching patient:', error);
        throw error;
    }
};

/**
 * Get detailed patient information for psychologist (only assigned patients)
 * @param id - UUID del paziente
 */
export const getPatientDetailsByPsychologist = async (id: string): Promise<any> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const cf = getCurrentUser()?.fiscalCode || getCurrentUser()?.email;

        const response = await axios.get(`${API_URL}/psi/patients/${id}?cf=${cf}`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching patient details:', error);
        throw error;
    }
};
