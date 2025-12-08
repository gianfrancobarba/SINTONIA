import React from 'react';

type BadgeIconProps = {
    name: string;
    className?: string;
    size?: number;
};

export const BadgeIcon: React.FC<BadgeIconProps> = ({ name, className, size = 48 }) => {
    const getIcon = () => {
        switch (name) {
            // ================== QUESTIONARI ==================
            case 'Primo Questionario':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="12" y="8" width="40" height="48" rx="4" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="2" />
                        <path d="M20 20H44" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20 28H44" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20 36H30" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="46" cy="46" r="14" fill="#FCD34D" stroke="#B45309" strokeWidth="2" />
                        <text x="46" y="52" textAnchor="middle" fill="#78350F" fontSize="16" fontWeight="bold">1</text>
                    </svg>
                );
            case 'Cinque Questionari':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8" y="12" width="36" height="44" rx="3" fill="#C7D2FE" stroke="#4F46E5" strokeWidth="2" />
                        <rect x="14" y="8" width="36" height="44" rx="3" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="2" />
                        <circle cx="44" cy="44" r="16" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" />
                        <text x="44" y="50" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">5</text>
                    </svg>
                );
            case 'Dieci Questionari':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="32" cy="32" r="26" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
                        <path d="M14 42C14 42 18 24 32 16C46 24 50 42 50 42" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" fill="none" />
                        <text x="32" y="40" textAnchor="middle" fill="#78350F" fontSize="20" fontWeight="bold">10</text>
                    </svg>
                );
            case 'Venticinque Questionari':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 14H46L42 44C42 50.6 37.6 56 32 56C26.4 56 22 50.6 22 44L18 14Z" fill="#FCD34D" stroke="#B45309" strokeWidth="2" />
                        <path d="M18 18H10C7.8 18 6 19.8 6 22V26C6 28.2 7.8 30 10 30H19" stroke="#B45309" strokeWidth="2" fill="none" />
                        <path d="M46 18H54C56.2 18 58 19.8 58 22V26C58 28.2 56.2 30 54 30H45" stroke="#B45309" strokeWidth="2" fill="none" />
                        <rect x="26" y="56" width="12" height="4" rx="1" fill="#B45309" />
                        <text x="32" y="38" textAnchor="middle" fill="#78350F" fontSize="14" fontWeight="bold">25</text>
                    </svg>
                );
            case 'Screening Completo':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Clipboard body */}
                        <rect x="10" y="8" width="44" height="52" rx="4" fill="#ECFEFF" stroke="#0891B2" strokeWidth="2.5" />
                        {/* Clipboard clip */}
                        <rect x="22" y="4" width="20" height="10" rx="3" fill="#06B6D4" stroke="#0891B2" strokeWidth="2" />
                        <circle cx="32" cy="9" r="3" fill="#CFFAFE" />
                        {/* 4 checkmarks for 4 questionnaires */}
                        <path d="M18 24L22 28L30 20" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18 36L22 40L30 32" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M34 24L38 28L46 20" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M34 36L38 40L46 32" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Golden star badge for completion */}
                        <path d="M32 48L34 52L38 52L35 55L36 59L32 56L28 59L29 55L26 52L30 52Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
                    </svg>
                );

            // ================== DIARIO ==================
            case 'Prima Nota Diario':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="12" y="10" width="32" height="44" rx="2" fill="#F3F4F6" stroke="#4B5563" strokeWidth="2" />
                        <path d="M20 22H36" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20 30H36" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20 38H28" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M38 38L54 12L58 16L42 42H38V38Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
                    </svg>
                );
            case 'Diario Costante':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Stack of pages (back) */}
                        <rect x="18" y="8" width="32" height="42" rx="2" fill="#E5E7EB" stroke="#6B7280" strokeWidth="1.5" />
                        <rect x="14" y="12" width="32" height="42" rx="2" fill="#F3F4F6" stroke="#6B7280" strokeWidth="1.5" />
                        {/* Main page (front) */}
                        <rect x="10" y="16" width="32" height="42" rx="2" fill="white" stroke="#4B5563" strokeWidth="2" />
                        {/* Text lines */}
                        <path d="M16 26H36" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16 34H32" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16 42H28" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        {/* Pencil */}
                        <path d="M44 50L56 14L60 16L48 52L44 50Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
                        <path d="M56 14L58 10L62 12L60 16L56 14Z" fill="#EC4899" />
                        <path d="M44 50L42 56L48 52L44 50Z" fill="#78350F" />
                    </svg>
                );
            case 'Narratore':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Book spine */}
                        <path d="M32 12V56" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                        {/* Left page */}
                        <path d="M32 12C24 12 8 16 8 16V52C8 52 24 48 32 56" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
                        {/* Right page */}
                        <path d="M32 12C40 12 56 16 56 16V52C56 52 40 48 32 56" fill="#FFFBEB" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
                        {/* Text lines on left page */}
                        <path d="M14 26H26" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
                        <path d="M14 34H24" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
                        <path d="M14 42H22" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
                        {/* Text lines on right page */}
                        <path d="M38 26H50" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
                        <path d="M38 34H48" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
                        <path d="M38 42H46" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
                        {/* Quill pen */}
                        <path d="M50 6L44 20L48 22L54 8L50 6Z" fill="#7C3AED" stroke="#5B21B6" strokeWidth="1" />
                        <path d="M44 20L42 26" stroke="#5B21B6" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                );
            case 'Diario Esperto':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="16" y="10" width="32" height="48" rx="2" fill="#7C3AED" stroke="#5B21B6" strokeWidth="2" />
                        <path d="M44 10V32L38 26L32 32V10" fill="#FCD34D" />
                        <circle cx="40" cy="44" r="12" fill="#F472B6" stroke="#BE185D" strokeWidth="2" />
                        <path d="M40 38L42 42H46L43 45L44 49L40 46L36 49L37 45L34 42H38L40 38Z" fill="white" />
                    </svg>
                );

            // ================== STATO D'ANIMO ==================
            case 'Primo Stato dAnimo':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Main happy face */}
                        <circle cx="32" cy="32" r="26" fill="#FDE047" stroke="#EAB308" strokeWidth="2.5" />
                        {/* Eyes */}
                        <ellipse cx="23" cy="28" rx="3.5" ry="4" fill="#78350F" />
                        <ellipse cx="41" cy="28" rx="3.5" ry="4" fill="#78350F" />
                        {/* Eye sparkles */}
                        <circle cx="24" cy="26" r="1.5" fill="white" />
                        <circle cx="42" cy="26" r="1.5" fill="white" />
                        {/* Blush cheeks */}
                        <ellipse cx="16" cy="36" rx="4" ry="3" fill="#FBBF24" opacity="0.6" />
                        <ellipse cx="48" cy="36" rx="4" ry="3" fill="#FBBF24" opacity="0.6" />
                        {/* Big smile */}
                        <path d="M20 40C20 40 24 48 32 48C40 48 44 40 44 40" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                        {/* Small heart */}
                        <path d="M52 10C52 10 48 6 48 10C48 6 44 10 44 10C44 10 48 16 48 16C48 16 52 10 52 10Z" fill="#EC4899" />
                    </svg>
                );
            case 'Monitoraggio Umore':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Chart background */}
                        <rect x="6" y="10" width="52" height="44" rx="4" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="2" />
                        {/* Line chart path */}
                        <path d="M12 42L20 36L28 40L36 24L44 30L52 18" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        {/* Data points - colored for different moods */}
                        <circle cx="12" cy="42" r="3" fill="#EC4899" />
                        <circle cx="20" cy="36" r="3" fill="#F59E0B" />
                        <circle cx="28" cy="40" r="3" fill="#EF4444" />
                        <circle cx="36" cy="24" r="3" fill="#10B981" />
                        <circle cx="44" cy="30" r="3" fill="#3B82F6" />
                        <circle cx="52" cy="18" r="3" fill="#10B981" />
                        {/* Heart at bottom */}
                        <path d="M32 58C32 58 26 54 26 51C26 49 27.5 47.5 29.5 47.5C30.8 47.5 32 48.5 32 48.5C32 48.5 33.2 47.5 34.5 47.5C36.5 47.5 38 49 38 51C38 54 32 58 32 58Z" fill="#EC4899" />
                    </svg>
                );
            case 'Streak Week':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 6C32 6 18 22 18 38C18 48 24 56 32 56C40 56 46 48 46 38C46 22 32 6 32 6Z" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
                        <path d="M32 20C32 20 24 32 24 40C24 46 28 50 32 50C36 50 40 46 40 40C40 32 32 20 32 20Z" fill="#FCD34D" />
                        <text x="32" y="44" textAnchor="middle" fill="#9A3412" fontSize="16" fontWeight="bold">7</text>
                    </svg>
                );
            case 'Streak Master':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 10C32 10 14 28 14 44C14 56 22 62 32 62C42 62 50 56 50 44C50 28 32 10 32 10Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
                        <path d="M32 24C32 24 20 38 20 48C20 54 26 58 32 58C38 58 44 54 44 48C44 38 32 24 32 24Z" fill="#FCD34D" />
                        <path d="M20 14L24 22L32 10L40 22L44 14" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        <text x="32" y="52" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="bold">30</text>
                    </svg>
                );

            // ================== FORUM ==================
            case 'Prima Domanda Forum':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Main speech bubble */}
                        <path d="M8 12C8 8 11 5 15 5H49C53 5 56 8 56 12V38C56 42 53 45 49 45H30L16 56V45H15C11 45 8 42 8 38V12Z" fill="#A7F3D0" stroke="#059669" strokeWidth="2.5" />
                        {/* Question mark */}
                        <text x="32" y="34" textAnchor="middle" fill="#047857" fontSize="28" fontWeight="bold">?</text>
                        {/* Small star */}
                        <path d="M50 8L52 12L56 12L53 15L54 19L50 16L46 19L47 15L44 12L48 12Z" fill="#FBBF24" />
                    </svg>
                );
            case 'Voce Attiva':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Megaphone body */}
                        <path d="M10 26V42H20L42 58V10L20 26H10Z" fill="#F472B6" stroke="#DB2777" strokeWidth="2.5" strokeLinejoin="round" />
                        {/* Megaphone handle */}
                        <rect x="4" y="30" width="8" height="8" rx="2" fill="#DB2777" />
                        {/* Sound waves */}
                        <path d="M48 22C54 28 54 44 48 50" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
                        <path d="M54 14C62 24 62 48 54 58" stroke="#F9A8D4" strokeWidth="2.5" strokeLinecap="round" />
                        {/* Number 5 badge */}
                        <circle cx="48" cy="14" r="10" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
                        <text x="48" y="18" textAnchor="middle" fill="#78350F" fontSize="12" fontWeight="bold">5</text>
                    </svg>
                );
            case 'Prima Risposta Ricevuta':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Original message bubble (left/back) */}
                        <path d="M6 14C6 10 9 7 13 7H32C36 7 39 10 39 14V28C39 32 36 35 32 35H18L10 42V35H13C9 35 6 32 6 28V14Z" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2" />
                        {/* Reply bubble (right/front, overlapping) */}
                        <path d="M24 26C24 22 27 19 31 19H51C55 19 58 22 58 26V42C58 46 55 49 51 49H38L30 57V49H31C27 49 24 46 24 42V26Z" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
                        {/* Checkmark in reply bubble */}
                        <path d="M36 36L40 40L50 30" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Notification dot */}
                        <circle cx="54" cy="16" r="6" fill="#EF4444" stroke="#FFF" strokeWidth="1.5" />
                    </svg>
                );

            default:
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="32" cy="32" r="26" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" />
                        <path d="M32 18L36 30H48L38 38L42 50L32 42L22 50L26 38L16 30H28L32 18Z" fill="#D1D5DB" />
                    </svg>
                );
        }
    };

    return (
        <div style={{ width: size, height: size }} className={className}>
            {getIcon()}
        </div>
    );
};
