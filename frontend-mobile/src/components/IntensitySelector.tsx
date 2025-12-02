import React from 'react';
import '../css/IntensitySelector.css';

interface IntensitySelectorProps {
    value: number | null;
    onChange: (value: number) => void;
}

const IntensitySelector: React.FC<IntensitySelectorProps> = ({ value, onChange }) => {
    const intensityLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <div className="intensity-selector">
            <div className="intensity-display">
                {value !== null ? value : '-'}
            </div>
            <div className="intensity-buttons">
                {intensityLevels.map((level) => (
                    <button
                        key={level}
                        className={`intensity-button ${value === level ? 'selected' : ''}`}
                        onClick={() => onChange(level)}
                        aria-label={`Intensità ${level}`}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default IntensitySelector;
