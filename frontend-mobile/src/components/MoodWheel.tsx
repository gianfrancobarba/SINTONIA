import React, { useState, useRef, useEffect } from 'react';
import { MOOD_CONFIGS } from '../types/mood';
import type { Umore } from '../types/mood';
import '../css/MoodWheel.css';

interface MoodWheelProps {
    value: Umore | null;
    onChange: (mood: Umore | null) => void;
    onConfirm: () => void;
}

const MoodWheel: React.FC<MoodWheelProps> = ({ value, onChange, onConfirm }) => {
    const wheelRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startAngle, setStartAngle] = useState(0);
    const [startRotation, setStartRotation] = useState(0);

    // Trova la configurazione dell'umore selezionato
    const selectedConfig = value ? MOOD_CONFIGS.find(m => m.umore === value) : null;

    // Inizializza la rotazione per centrare l'umore selezionato o il primo
    useEffect(() => {
        if (value) {
            const config = MOOD_CONFIGS.find(m => m.umore === value);
            if (config) {
                setRotation(-90 - config.angle);
            }
        } else {
            setRotation(-90 - MOOD_CONFIGS[0].angle);
        }
    }, []);

    const getAngle = (clientX: number, clientY: number) => {
        if (!wheelRef.current) return 0;
        const rect = wheelRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    };

    const handleStart = (clientX: number, clientY: number) => {
        setIsDragging(true);
        setStartAngle(getAngle(clientX, clientY));
        setStartRotation(rotation);
    };

    const handleMove = (clientX: number, clientY: number) => {
        if (!isDragging) return;
        const currentAngle = getAngle(clientX, clientY);
        const delta = currentAngle - startAngle;
        let newRotation = startRotation + delta;

        setRotation(newRotation);

        let targetAngle = (-90 - newRotation) % 360;
        if (targetAngle < 0) targetAngle += 360;

        const sliceAngle = 360 / MOOD_CONFIGS.length;
        const index = Math.round(targetAngle / sliceAngle) % MOOD_CONFIGS.length;
        const safeIndex = (index + MOOD_CONFIGS.length) % MOOD_CONFIGS.length;

        const newMood = MOOD_CONFIGS[safeIndex].umore;

        if (newMood !== value) {
            onChange(newMood);
        }
    };

    const handleEnd = () => {
        setIsDragging(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY);
    const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleEnd();
    const handleTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
    const handleTouchEnd = () => handleEnd();

    useEffect(() => {
        const handleGlobalMove = (e: MouseEvent) => { if (isDragging) handleMove(e.clientX, e.clientY); };
        const handleGlobalUp = () => { if (isDragging) handleEnd(); };
        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMove);
            window.addEventListener('mouseup', handleGlobalUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
        };
    }, [isDragging]);

    return (
        <div className="immersive-wheel-container">
            <div className="emoji-display-container" onClick={onConfirm}>
                <div className="selected-mood-text">
                    {selectedConfig ? `Mi sento ${selectedConfig.umore}` : 'Come ti senti?'}
                </div>
                <div className="emoji-large-clickable">
                    {selectedConfig ? selectedConfig.emoji : '😐'}
                </div>
                <div className="tap-hint">Tocca per continuare</div>

                <div className="wheel-pointer">▼</div>
            </div>

            <div className="wheel-overflow-wrapper">
                <div className="wheel-positioner">
                    <div
                        className="rotating-wheel"
                        ref={wheelRef}
                        style={{ transform: `rotate(${rotation}deg)` }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <svg viewBox="0 0 100 100" className="wheel-svg-content">
                            {/* No defs needed as we removed shadows */}

                            {MOOD_CONFIGS.map((config, index) => {
                                const totalSlices = MOOD_CONFIGS.length;
                                const sliceAngle = 360 / totalSlices;
                                const startA = index * sliceAngle;
                                const endA = (index + 1) * sliceAngle;

                                const cx = 50;
                                const cy = 50;
                                const r = 50;

                                const startRad = (startA * Math.PI) / 180;
                                const endRad = (endA * Math.PI) / 180;

                                const x1 = cx + r * Math.cos(startRad);
                                const y1 = cy + r * Math.sin(startRad);
                                const x2 = cx + r * Math.cos(endRad);
                                const y2 = cy + r * Math.sin(endRad);

                                return (
                                    <g key={config.umore}>
                                        {/* Base Color - No Stroke, No Shadow */}
                                        <path
                                            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                                            fill={config.color}
                                            stroke="none"
                                        />
                                    </g>
                                );
                            })}

                            {/* Center Hole - r=30 makes slices shorter */}
                            <circle cx="50" cy="50" r="30" fill="#eaf6f8" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoodWheel;
