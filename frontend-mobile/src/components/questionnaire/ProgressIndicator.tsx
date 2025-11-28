import React from 'react';
import '../../css/ProgressIndicator.css';

interface ProgressIndicatorProps {
    current: number;
    total: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ current, total }) => {
    return (
        <div className="progress-indicator">
            {current} di {total}
        </div>
    );
};

export default ProgressIndicator;
