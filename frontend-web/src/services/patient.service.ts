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
