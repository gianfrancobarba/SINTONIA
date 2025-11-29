import axios from 'axios';
import type { InvalidationRequestData } from '../types/invalidation';
import { getCurrentUser } from './auth.service';

const API_URL = 'http://localhost:3000';

/**
 * Fetch all invalidation requests (admin only)
 */
export const fetchInvalidationRequests = async (): Promise<InvalidationRequestData[]> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        const response = await axios.get(`${API_URL}/admin/invalidation-requests`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching invalidation requests:', error);
        throw error;
    }
};

/**
 * Accept an invalidation request (admin only)
 */
export const acceptInvalidationRequest = async (id: string): Promise<void> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        await axios.post(`${API_URL}/admin/invalidation-requests/${id}/accept`, {}, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error accepting invalidation request:', error);
        throw error;
    }
};

/**
 * Reject an invalidation request (admin only)
 */
export const rejectInvalidationRequest = async (id: string): Promise<void> => {
    try {
        const token = getCurrentUser()?.access_token as string | undefined;
        await axios.post(`${API_URL}/admin/invalidation-requests/${id}/reject`, {}, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error rejecting invalidation request:', error);
        throw error;
    }
};
