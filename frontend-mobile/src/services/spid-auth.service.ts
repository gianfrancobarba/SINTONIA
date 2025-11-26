import axios from 'axios';

const API_URL = 'http://localhost:3000/spid-auth';

export const startSPIDLogin = () => {
    // Redirect to backend SPID login endpoint
    window.location.href = `${API_URL}/login`;
};

export const handleSPIDCallback = (token: string) => {
    if (token) {
        localStorage.setItem('patient_token', token);
        return true;
    }
    return false;
};

export const getCurrentPatient = () => {
    const token = localStorage.getItem('patient_token');
    if (!token) return null;

    // Decode JWT (simplified, in production use jwt-decode)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (e) {
        return null;
    }
};

export const logout = () => {
    localStorage.removeItem('patient_token');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('patient_token');
};

export const updateLocalTerms = (status: boolean) => {
    const token = localStorage.getItem('patient_token');
    if (!token) return;

    // In a real JWT scenario we can't modify the token signature client-side.
    // However, for this implementation we might need to rely on the backend returning a NEW token
    // OR we just store a local flag if we trust the client state until next refresh.
    // Ideally, the backend endpoint `POST /patient/terms` should return a new token.
    // Let's assume for now we just want to bypass the check in the current session if we don't get a new token.
    // But wait, `getCurrentPatient` parses the token. We can't change the token.
    // So we should probably refresh the page or ask the user to re-login? 
    // NO, that's bad UX.
    // The best way is: Backend returns a NEW token on acceptance.
};
