import React, { useRef } from 'react';
import '../css/QuestionScale.css';

interface QuestionScaleProps {
    value: number | null;
    onChange: (value: number) => void;
    maxValue?: number;
    minValue?: number;
    labels?: string[]; // Array of labels for each option
}

// Mappa dei valori alle etichette di frequenza (fallback se non ci sono labels)
const FREQUENCY_LABELS: Record<number, string> = {
    0: 'Mai',
    1: 'Raramente',
    2: 'A volte',
    3: 'Spesso',
    4: 'Sempre',
};

const QuestionScale: React.FC<QuestionScaleProps> = ({
    value,
    onChange,
    maxValue = 5,
    minValue = 1,
    labels
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);

    const scaleValues = Array.from(
        { length: maxValue - minValue + 1 },
        (_, i) => minValue + i
    );

    const getLabel = (scaleValue: number): string => {
        if (labels && labels.length > 0) {
            const index = scaleValue - minValue;
            return labels[index] || String(scaleValue);
        }
        return FREQUENCY_LABELS[scaleValue] || String(scaleValue);
    };

    const getValueFromTouch = (clientX: number): number | null => {
        if (!containerRef.current) return null;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = x / rect.width;
        const index = Math.round(percentage * (scaleValues.length - 1));

        if (index >= 0 && index < scaleValues.length) {
            return scaleValues[index];
        }
        return null;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        isDraggingRef.current = true;
        const touch = e.touches[0];
        const val = getValueFromTouch(touch.clientX);
        if (val !== null) {
            onChange(val);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDraggingRef.current) return;
        e.preventDefault(); // Prevent scrolling while dragging
        const touch = e.touches[0];
        const val = getValueFromTouch(touch.clientX);
        if (val !== null) {
            onChange(val);
        }
    };

    const handleTouchEnd = () => {
        isDraggingRef.current = false;
    };

    return (
        <div className="question-scale">
            {/* Label dinamica che appare sopra quando un valore è selezionato */}
            <div className="scale-selected-label">
                {value !== null ? getLabel(value) : '\u00A0'}
            </div>

            <div
                className="scale-container"
                ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {scaleValues.map((scaleValue, index) => (
                    <React.Fragment key={scaleValue}>
                        <button
                            className={`scale-point ${value !== null && scaleValue <= value ? 'selected' : ''}`}
                            onClick={() => onChange(scaleValue)}
                            type="button"
                            aria-label={getLabel(scaleValue)}
                        >
                            {value !== null && scaleValue <= value && (
                                <div className="scale-point-inner" />
                            )}
                        </button>
                        {index < scaleValues.length - 1 && (
                            <div
                                className={`scale-line ${value !== null && scaleValue < value ? 'selected' : ''}`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default QuestionScale;
