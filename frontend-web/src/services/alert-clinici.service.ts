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
 * Accept a clinical alert (mock implementation)
 * Since there's no backend endpoint for accepting alerts,
 * this is a mock that simulates the action
 * @param id - Alert ID to accept
 */
export const acceptClinicalAlert = async (id: string): Promise<void> => {
    // Mock implementation - in real scenario, this would call:
    // await axiosInstance.patch(`/psi/clinical-alerts/${id}/accept`);

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Alert ${id} accepted (mock)`);
            resolve();
        }, 500);
    });
};
