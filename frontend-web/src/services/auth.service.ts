
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:3000/auth';

interface JwtPayload {
    email: string;
    sub: string;
    role: 'admin' | 'psychologist';
    iat: number;
    exp: number;
    fiscalCode?: string; // Add fiscalCode to payload interface
}

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.access_token) {
        // Decode JWT to extract role
        const decoded = jwtDecode<JwtPayload>(response.data.access_token);

        // Save both token and decoded info
        const userData = {
            ...response.data,
            id: decoded.sub,
            role: decoded.role,
            email: decoded.email,
            fiscalCode: decoded.fiscalCode, // Extract fiscalCode
        };

        localStorage.setItem('user', JSON.stringify(userData));
    }
    return response.data;
};

export const handleSpidToken = (token: string) => {
    const decoded = jwtDecode<JwtPayload>(token);
    const userData = {
        access_token: token,
        id: decoded.sub,
        role: decoded.role,
        email: decoded.email,
        fiscalCode: decoded.fiscalCode, // Extract fiscalCode
        // Add other fields if needed from token
    };
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
};

export const logout = () => {
    localStorage.removeItem('user');
};

interface User {
    id: string;
    email: string;
    role: 'admin' | 'psychologist';
    access_token: string;
    fiscalCode?: string;
    [key: string]: any;
}

export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user: User = JSON.parse(userStr);
        // If id or fiscalCode is missing but we have a token, try to recover it
        if ((!user.id || !user.fiscalCode) && user.access_token) {
            try {
                const decoded = jwtDecode<JwtPayload>(user.access_token);
                user.id = decoded.sub;
                user.fiscalCode = decoded.fiscalCode; // Recover fiscalCode
                // Update storage to persist the fix
                localStorage.setItem('user', JSON.stringify(user));
            } catch (e) {
                console.error('Error recovering user ID from token:', e);
            }
        }
        return user;
    }
    return null;
};

export const getUserRole = (): 'admin' | 'psychologist' | null => {
    const user = getCurrentUser();
    return user?.role || null;
};
