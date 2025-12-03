/**
 * Service per la gestione delle chiamate API relative allo stato d'animo
 */

import type { CreateMoodDto, MoodResponse } from '../types/mood';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Crea un nuovo stato d'animo per il paziente autenticato
 * @param umore - Tipo di umore selezionato
 * @param intensita - Intensità dell'umore (1-10, opzionale)
 * @param note - Note testuali (opzionale, max 500 caratteri)
 * @returns Promise con l'ID e la data di inserimento
 */
export async function createMood(
    umore: string,
    intensita?: number,
    note?: string
): Promise<MoodResponse> {
    const token = localStorage.getItem('patient_token');

    if (!token) {
        throw new Error('Token di autenticazione non trovato');
    }

    const body: CreateMoodDto = {
        umore: umore as any,
        intensita,
        note,
    };

    const response = await fetch(`${API_BASE_URL}/paziente/stato-animo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Errore durante l'inserimento dello stato d'animo: ${response.status}`
        );
    }

    return response.json();
    return response.json();
}

/**
 * Recupera lo stato d'animo odierno del paziente
 */
export async function getTodayMood(): Promise<MoodResponse & CreateMoodDto | null> {
    const token = localStorage.getItem('patient_token');
    if (!token) throw new Error('Token non trovato');

    const response = await fetch(`${API_BASE_URL}/paziente/stato-animo/oggi`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Errore nel recupero dello stato d\'animo');

    return response.json();
}

/**
 * Elimina lo stato d'animo odierno
 */
export async function deleteMood(): Promise<void> {
    const token = localStorage.getItem('patient_token');
    if (!token) throw new Error('Token non trovato');

    const response = await fetch(`${API_BASE_URL}/paziente/stato-animo/oggi`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Errore durante l\'eliminazione');
}
