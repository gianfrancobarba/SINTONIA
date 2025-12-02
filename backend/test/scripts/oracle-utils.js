/**
 * Utility functions for oracle generation scripts
 */

export const CONFIG = {
    // Numero di test cases casuali da generare
    numRandomSuccessCases: 15,
    numRandomEdgeCases: 20,
    numStressCases: 5,

    // Enum valori umore (dal database schema)
    umoreEnum: [
        'Felice',
        'Sereno',
        'Energico',
        'Neutro',
        'Stanco',
        'Triste',
        'Ansioso',
        'Arrabbiato',
        'Spaventato',
        'Confuso',
    ],

    // Range intensità
    intensitaMin: 1,
    intensitaMax: 10,

    // Probabilità che un campo opzionale sia null
    nullProbabilityIntensita: 0.3, // 30%
    nullProbabilityNote: 0.3,      // 30%

    // Range giorni per storico
    giorniMin: 1,
    giorniMax: 90,
};

export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function maybeNull(value, probability) {
    return Math.random() < probability ? null : value;
}

export function randomDateInLastDays(days) {
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    const randomMs = Math.random() * days * msPerDay;
    return new Date(now.getTime() - randomMs);
}

export function generateRandomNote() {
    const notes = [
        'Giornata produttiva',
        'Mi sento bene',
        'Un po\' stanco ma va bene',
        'Ottima giornata',
        'Giornata difficile',
        'Tutto ok',
        'Niente di particolare',
        'Giornata nella media',
        'Mi sento meglio di ieri',
        'Situazione stabile',
        'Qualche preoccupazione',
        'Giornata tranquilla',
        'Molto positivo oggi',
        'Un po\' giù di morale',
        'Energia alta',
        'Serve riposo',
        'Giornata intensa',
        'Tutto procede bene',
        'Qualche difficoltà',
        'Ottimo umore',
        'Giornata normale',
        'Nulla di speciale',
        'Buon risveglio',
        'Stanchezza generale',
        'Giornata lunga',
    ];
    return randomChoice(notes);
}

export function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
