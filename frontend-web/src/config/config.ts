/**
 * Application configuration
 * Reads from environment variables set in .env.development
 */

export const config = {
    /**
     * Backend API base URL
     */
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',

    /**
     * Temporary psychologist codice fiscale for testing
     * TODO: Replace with actual authentication system
     */
    psychologistCF: import.meta.env.VITE_PSI_CF || 'RSSMRA80A01H501U',
} as const;
