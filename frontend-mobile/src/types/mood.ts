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
    emoji: string;
    color: string;
    angle: number; // Angolo sulla ruota (0-180 gradi)
}

/**
 * Configurazione degli umori per la ruota interattiva
 * Ordinati da sinistra (negativo) a destra (positivo)
 */
export const MOOD_CONFIGS: MoodConfig[] = [
    { umore: 'Arrabbiato', emoji: '😠', color: '#E53935', angle: 0 },
    { umore: 'Spaventato', emoji: '😨', color: '#F57C00', angle: 18 },
    { umore: 'Ansioso', emoji: '😰', color: '#FB8C00', angle: 36 },
    { umore: 'Triste', emoji: '😢', color: '#2196F3', angle: 54 },
    { umore: 'Stanco', emoji: '😴', color: '#9E9E9E', angle: 72 },
    { umore: 'Neutro', emoji: '😐', color: '#FDD835', angle: 90 },
    { umore: 'Confuso', emoji: '😕', color: '#9C27B0', angle: 108 },
    { umore: 'Sereno', emoji: '😌', color: '#66BB6A', angle: 126 },
    { umore: 'Energico', emoji: '⚡', color: '#FFA726', angle: 144 },
    { umore: 'Felice', emoji: '😊', color: '#4CAF50', angle: 162 },
];
