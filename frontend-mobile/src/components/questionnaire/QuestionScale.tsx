import React from 'react';
import '../../css/QuestionScale.css';

interface QuestionScaleProps {
    value: number | null;
    onChange: (value: number) => void;
    maxValue?: number;
    minValue?: number;
}

// Mappa dei valori alle etichette di frequenza
const FREQUENCY_LABELS: Record<number, string> = {
    1: 'Mai',
    2: 'Raramente',
    3: 'A volte',
    4: 'Spesso',
    5: 'Sempre',
};

const QuestionScale: React.FC<QuestionScaleProps> = ({
    value,
    onChange,
    maxValue = 5,
    minValue = 1
}) => {
    const scaleValues = Array.from(
        { length: maxValue - minValue + 1 },
        (_, i) => minValue + i
    );

    return (
        <div className="question-scale">
            {/* Label dinamica che appare sopra quando un valore è selezionato */}
            {value !== null && (
                <div className="scale-selected-label">
                    {FREQUENCY_LABELS[value] || value}
                </div>
            )}

            <div className="scale-container">
                {scaleValues.map((scaleValue, index) => (
                    <React.Fragment key={scaleValue}>
                        <button
                            className={`scale-point ${value !== null && scaleValue <= value ? 'selected' : ''}`}
                            onClick={() => onChange(scaleValue)}
                            type="button"
                            aria-label={`${FREQUENCY_LABELS[scaleValue] || scaleValue}`}
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
