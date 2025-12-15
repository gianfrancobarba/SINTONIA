import React from 'react';
import type { Umore } from '../types/mood';

interface MoodIconProps {
    mood: Umore;
    size?: number;
    className?: string;
}

const MoodIcon: React.FC<MoodIconProps> = ({ mood, size = 100, className = '' }) => {
    const commonProps = {
        width: size,
        height: size,
        viewBox: "0 0 100 100",
        className: className,
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    };

    const renderFace = () => {
        switch (mood) {
            case 'Felice': // Teal #30B0C7
                return (
                    <>
                        <circle cx="50" cy="50" r="45" fill="#30B0C7" />
                        <path d="M30 40C30 40 32 35 38 35C44 35 46 40 46 40" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <path d="M54 40C54 40 56 35 62 35C68 35 70 40 70 40" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <path d="M30 60C30 60 40 75 50 75C60 75 70 60 70 60" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="25" cy="55" r="3" fill="rgba(255,255,255,0.4)" />
                        <circle cx="75" cy="55" r="3" fill="rgba(255,255,255,0.4)" />
                    </>
                );
            case 'Sereno': // Green #34C759
                return (
                    <>
                        <circle cx="50" cy="50" r="45" fill="#34C759" />
                        <path d="M28 42C28 42 32 38 38 38C44 38 48 42 48 42" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <path d="M52 42C52 42 56 38 62 38C68 38 72 42 72 42" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <path d="M35 65C35 65 42 68 50 68C58 68 65 65 65 65" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </>
                );
            case 'Energico': // Bright Yellow #FFD60A
                return (
                    <>
                        <circle cx="50" cy="50" r="45" fill="#FFD60A" />
                        <path d="M30 40L38 32L46 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M54 40L62 32L70 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M35 60C35 60 42 70 50 70C58 70 65 60 65 60Z" fill="white" />
                        <path d="M65 15L75 5L85 15" stroke="#FFD60A" strokeWidth="4" strokeLinecap="round" />
                    </>
                );
            case 'Neutro': // Gray #8E8E93
                return (
                    <>
                        <circle cx="50" cy="50" r="45" fill="#8E8E93" />
                        <circle cx="35" cy="40" r="4" fill="white" />
                        <circle cx="65" cy="40" r="4" fill="white" />
                        <line x1="35" y1="65" x2="65" y2="65" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </>
                );
            case 'Stanco': // Purple #5856D6
                return (
                    <>
                        <circle cx="50" cy="50" r="45" fill="#5856D6" />
                        <path d="M28 45L42 45" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <path d="M58 45L72 45" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="60" cy="70" r="6" fill="white" opacity="0.6" />
                        <path d="M75 25L85 15" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                        <path d="M80 35L88 28" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                    </>
                );
            case 'Triste': // Blue #007AFF
                return (
                    <>
                        <circle cx="50" cy="50" r="45" fill="#007AFF" />
                        <circle cx="35" cy="40" r="4" fill="white" />
                        <circle cx="65" cy="40" r="4" fill="white" />
                        <path d="M35 70C35 70 42 62 50 62C58 62 65 70 65 70" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <path d="M65 45L65 55" stroke="#74C2FF" strokeWidth="3" strokeLinecap="round" />
                    </>
                );
            case 'Ansioso': // Yellow-Orange #FFCC00
                return (
                    <>
                        <circle cx="50" cy="50" r="45" fill="#FFCC00" />
                        <circle cx="35" cy="40" r="5" fill="white" />
                        <circle cx="65" cy="40" r="5" fill="white" />
                        <path d="M35 65C38 62 42 68 45 65C48 62 52 68 55 65C58 62 62 68 65 65" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        <path d="M20 30L30 25" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        <path d="M80 30L70 25" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </>
                );
            case 'Arrabbiato': // Red #FF3B30
                return (
                    <>
                        <circle cx="50" cy="50" r="45" fill="#FF3B30" />
                        <path d="M28 35L42 42" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <path d="M72 35L58 42" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="38" cy="50" r="4" fill="white" />
                        <circle cx="62" cy="50" r="4" fill="white" />
                        <path d="M38 70C38 70 44 65 50 65C56 65 62 70 62 70" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </>
                );
            case 'Spaventato': // Orange #FF9500
                return (
                    <>
                        <circle cx="50" cy="50" r="45" fill="#FF9500" />
                        <circle cx="35" cy="40" r="6" fill="white" />
                        <circle cx="65" cy="40" r="6" fill="white" />
                        <circle cx="35" cy="40" r="2" fill="#FF9500" />
                        <circle cx="65" cy="40" r="2" fill="#FF9500" />
                        <ellipse cx="50" cy="65" rx="10" ry="12" fill="white" />
                        <path d="M25 25L35 28" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        <path d="M75 25L65 28" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </>
                );
            case 'Confuso': // Violet #AF52DE
                return (
                    <>
                        <circle cx="50" cy="50" r="45" fill="#AF52DE" />
                        <circle cx="35" cy="40" r="5" fill="white" />
                        <circle cx="65" cy="40" r="4" fill="white" />
                        <path d="M25 30L40 28" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        <path d="M60 25L75 22" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        <path d="M35 65C35 65 42 60 50 65C58 70 65 65 65 65" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </>
                );
            default:
                return <circle cx="50" cy="50" r="45" fill="#ccc" />;
        }
    };

    return (
        <svg {...commonProps}>
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            {renderFace()}
        </svg>
    );
};

export default MoodIcon;
