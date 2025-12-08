import React, { useState, useRef, useEffect } from 'react';
import { MOOD_CONFIGS } from '../types/mood';
import type { Umore } from '../types/mood';
import '../css/MoodWheel.css';
import TrashIcon from '../assets/icons/trash.svg';
import MoodIcon from './MoodIcons';

interface MoodWheelProps {
    value: Umore | null;
    onChange: (mood: Umore | null) => void;
    onConfirm: () => void;
    onDelete?: () => void;
    showDelete?: boolean;
}

const MoodWheel: React.FC<MoodWheelProps> = ({ value, onChange, onConfirm, onDelete, showDelete }) => {
    const wheelRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startAngle, setStartAngle] = useState(0);
    const [startRotation, setStartRotation] = useState(0);

    // Trova la configurazione dell'umore selezionato
    const selectedConfig = value ? MOOD_CONFIGS.find(m => m.umore === value) : null;

    // Inizializza la rotazione per centrare l'umore selezionato o il primo
    useEffect(() => {
        const totalSlices = MOOD_CONFIGS.length;
        const sliceAngle = 360 / totalSlices;
        const centerOffset = sliceAngle / 2;

        if (isDragging) return;

        if (value) {
            const index = MOOD_CONFIGS.findIndex(m => m.umore === value);
            if (index !== -1) {
                // Target: Arrow (Top) points to Center of Slice
                // Page Angle (Top) = -90
                // SVG Angle (Center) = index * 36 + 18
                // CSS Rotation = -90
                // -90 = (index * 36 + 18) - 90 + Rotation
                // Rotation = -(index * 36 + 18)
                setRotation(-(index * sliceAngle + centerOffset));
            }
        } else {
            // Default to first item
            setRotation(-(0 * sliceAngle + centerOffset));
        }
    }, [value]);

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

        // Calculate which slice is at the Top (Arrow position)
        // Arrow is at Page -90deg.
        // CSS rotates SVG by -90deg.
        // So Arrow is at SVG 0deg relative to the rotated container.
        // SliceAngle at Top = -Rotation
        let probeAngle = (-newRotation) % 360;
        if (probeAngle < 0) probeAngle += 360;

        const sliceAngle = 360 / MOOD_CONFIGS.length;
        // Use floor to correctly map [0, 36) to index 0
        // Use floor to correctly map [0, 36) to index 0
        const index = Math.floor(probeAngle / sliceAngle) % MOOD_CONFIGS.length;
        const safeIndex = (index + MOOD_CONFIGS.length) % MOOD_CONFIGS.length;

        const newMood = MOOD_CONFIGS[safeIndex].umore;

        if (newMood !== value) {
            onChange(newMood);
        }
    };

    const handleEnd = () => {
        setIsDragging(false);
        if (value) {
            const index = MOOD_CONFIGS.findIndex(m => m.umore === value);
            if (index !== -1) {
                const totalSlices = MOOD_CONFIGS.length;
                const sliceAngle = 360 / totalSlices;
                const centerOffset = sliceAngle / 2;

                // Calcola l'angolo target per centrare lo spicchio
                // Vogliamo che la freccia (Top) punti al centro dello spicchio
                // Rotation = -CenterAngle
                const centerAngle = index * sliceAngle + centerOffset;
                const targetRotation = -centerAngle;

                // Trova la rotazione equivalente più vicina all'attuale per evitare giri completi inutili
                // Calcola la differenza in modulo 360
                let diff = (targetRotation - rotation) % 360;
                // Normalizza tra -180 e 180
                if (diff > 180) diff -= 360;
                if (diff < -180) diff += 360;

                setRotation(rotation + diff);
            }
        }
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
                <div className="instruction-title">Inserisci il tuo stato d'animo</div>
                <div className="mood-text-row">
                    <div className="selected-mood-text">
                        {selectedConfig ? `Mi sento ${selectedConfig.umore}` : 'Inserisci il tuo stato d\'animo'}
                    </div>
                    {showDelete && onDelete && (
                        <div
                            className="text-side-delete-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                        >
                            <img src={TrashIcon} alt="Elimina" />
                        </div>
                    )}
                </div>
                <div className="emoji-large-clickable">
                    {selectedConfig ? (
                        <MoodIcon mood={selectedConfig.umore} size={140} />
                    ) : (
                        <div style={{ fontSize: '7rem' }}>😐</div>
                    )}
                </div>
                <div className="tap-hint">Tocca per continuare</div>
            </div>

            <div className="wheel-overflow-wrapper">
                {/* Realistic Pointer */}
                <div className="realistic-pointer">
                    <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 50L0 0H40L20 50Z" fill="#333" filter="url(#pointer-shadow)" />
                        <defs>
                            <filter id="pointer-shadow" x="-4" y="-4" width="48" height="58" filterUnits="userSpaceOnUse">
                                <feFlood floodOpacity="0.3" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="SourceAlpha" operator="in" />
                                <feOffset dy="2" />
                                <feComposite in="SourceGraphic" />
                            </filter>
                        </defs>
                    </svg>
                </div>

                <div className="wheel-positioner">
                    <div
                        className="rotating-wheel"
                        ref={wheelRef}
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <svg viewBox="0 0 100 100" className="wheel-svg-content">
                            <defs>
                                <filter id="center-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
                                    <feOffset dx="0" dy="1" result="offsetblur" />
                                    <feFlood floodColor="rgba(0,0,0,0.3)" />
                                    <feComposite in2="offsetblur" operator="in" />
                                    <feMerge>
                                        <feMergeNode />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

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

                                // Calculate icon position
                                const midAngle = (startA + endA) / 2;
                                const midRad = (midAngle * Math.PI) / 180;
                                const iconR = 40; // Position at radius 40 (between 30 and 50)
                                const iconX = cx + iconR * Math.cos(midRad);
                                const iconY = cy + iconR * Math.sin(midRad);
                                const iconSize = 12;

                                return (
                                    <g key={config.umore}>
                                        {/* Base Color - No Stroke, No Shadow */}
                                        <path
                                            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                                            fill={config.color}
                                            stroke="none"
                                        />
                                        {/* Icon on Slice */}
                                        <g transform={`translate(${iconX - iconSize / 2}, ${iconY - iconSize / 2}) rotate(${midAngle + 90}, ${iconSize / 2}, ${iconSize / 2})`}>
                                            <MoodIcon mood={config.umore} size={iconSize} />
                                        </g>
                                    </g>
                                );
                            })}

                            {/* Center Hole - r=30 makes slices shorter */}
                            <circle cx="50" cy="50" r="30" fill="#eaf6f8" filter="url(#center-shadow)" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoodWheel;
