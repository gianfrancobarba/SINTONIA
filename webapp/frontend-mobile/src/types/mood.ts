/**
 * Tipi TypeScript per la gestione dello stato d'animo del paziente
 */

export type Umore =
    | 'Felice'
    | 'Sereno'
    | 'Energico'
    | 'Neutro'
    | 'Stanco'
    | 'Triste'
    | 'Ansioso'
    | 'Arrabbiato'
    | 'Spaventato'
    | 'Confuso';

export interface CreateMoodDto {
    umore: Umore;
    intensita?: number;
    note?: string;
    dataInserimento?: string;
}

export interface MoodResponse {
    id: string;
    dataInserimento: Date;
}

/**
 * Configurazione per la visualizzazione degli umori nella ruota
 */
export interface MoodConfig {
    umore: Umore;
    color: string;
    angle: number; // Angolo sulla ruota (0-180 gradi)
}

/**
 * Configurazione degli umori per la ruota interattiva
 * Ordinati da sinistra (negativo) a destra (positivo)
 */
export const MOOD_CONFIGS: MoodConfig[] = [
    { umore: 'Arrabbiato', color: '#FF3B30', angle: 0 },   // Red
    { umore: 'Spaventato', color: '#FF9500', angle: 18 },  // Orange
    { umore: 'Ansioso', color: '#FFCC00', angle: 36 },    // Yellow-Orange
    { umore: 'Triste', color: '#007AFF', angle: 54 },     // Blue
    { umore: 'Stanco', color: '#5856D6', angle: 72 },     // Purple
    { umore: 'Neutro', color: '#8E8E93', angle: 90 },     // Gray
    { umore: 'Confuso', color: '#AF52DE', angle: 108 },    // Violet
    { umore: 'Sereno', color: '#34C759', angle: 126 },    // Green
    { umore: 'Energico', color: '#FFD60A', angle: 144 },    // Bright Yellow
    { umore: 'Felice', color: '#30B0C7', angle: 162 },    // Teal
];
