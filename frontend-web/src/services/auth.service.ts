
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:3000/auth';

interface JwtPayload {
    email: string;
    sub: string;
    role: 'admin' | 'psychologist';
    iat: number;
    exp: number;
}

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.access_token) {
        // Decode JWT to extract role
        const decoded = jwtDecode<JwtPayload>(response.data.access_token);

        // Save both token and decoded info
        const userData = {
            ...response.data,
            role: decoded.role,
            email: decoded.email,
        };

        localStorage.setItem('user', JSON.stringify(userData));
    }
    return response.data;
};

export const handleSpidToken = (token: string) => {
    const decoded = jwtDecode<JwtPayload>(token);
    const userData = {
        access_token: token,
        role: decoded.role,
        email: decoded.email,
        // Add other fields if needed from token
    };
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
};

export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
};

export const getUserRole = (): 'admin' | 'psychologist' | null => {
    const user = getCurrentUser();
    return user?.role || null;
};
