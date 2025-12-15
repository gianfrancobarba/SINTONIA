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
    intensita: number, // Mandatory
    note?: string,
    dataInserimento?: string
): Promise<MoodResponse> {
    const token = localStorage.getItem('patient_token');

    if (!token) {
        throw new Error('Token di autenticazione non trovato');
    }

    const body: CreateMoodDto = {
        umore: umore as any,
        intensita,
        note,
        dataInserimento,
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
}

/**
 * Aggiorna uno stato d'animo esistente
 * @param id - ID dello stato d'animo da aggiornare
 * @param umore - Tipo di umore selezionato
 * @param intensita - Intensità dell'umore (1-10, opzionale)
 * @param note - Note testuali (opzionale, max 500 caratteri)
 * @returns Promise con i dati aggiornati
 */
export async function updateMood(
    id: string,
    umore: string,
    intensita?: number,
    note?: string
): Promise<MoodResponse> {
    const token = localStorage.getItem('patient_token');

    if (!token) {
        throw new Error('Token di autenticazione non trovato');
    }

    const body: any = {
        umore,
        intensita,
        note,
    };

    const response = await fetch(`${API_BASE_URL}/paziente/stato-animo/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || `Errore durante l'aggiornamento dello stato d'animo: ${response.status}`
        );
    }

    return response.json();
}

/**
 * Recupera lo stato d'animo odierno del paziente
 */
export async function getTodayMood(): Promise<MoodResponse & CreateMoodDto | null> {
    const token = localStorage.getItem('patient_token');
    if (!token) throw new Error('Token non trovato');

    // Calcola la data locale in formato YYYY-MM-DD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const localDate = `${year}-${month}-${day}`;

    const response = await fetch(`${API_BASE_URL}/paziente/stato-animo/oggi?date=${localDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Errore nel recupero dello stato d\'animo');

    return response.json();
}

/**
 * Elimina uno stato d'animo specifico
 * @param id - ID dello stato d'animo da eliminare
 */
export async function deleteMood(id: string): Promise<void> {
    const token = localStorage.getItem('patient_token');
    if (!token) throw new Error('Token non trovato');

    const response = await fetch(`${API_BASE_URL}/paziente/stato-animo/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Errore durante l\'eliminazione');
}

/**
 * Interfaccia per un singolo entry dello storico mood
 */
export interface MoodHistoryEntry {
    id: string;
    date: string;
    umore: string;
    intensita?: number;
    note?: string;
}

/**
 * Interfaccia per la risposta dello storico
 */
export interface MoodHistoryResponse {
    entries: MoodHistoryEntry[];
}

/**
 * Recupera lo storico degli stati d'animo del paziente
 * @param giorni Numero di giorni da recuperare (default: 90)
 */
export async function getMoodHistory(giorni: number = 90): Promise<MoodHistoryResponse> {
    const token = localStorage.getItem('patient_token');
    if (!token) throw new Error('Token non trovato');

    const response = await fetch(`${API_BASE_URL}/paziente/stato-animo/storico?giorni=${giorni}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Errore nel recupero dello storico');

    return response.json();
}

