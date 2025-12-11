import React from 'react';
import '../css/LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
        </div>
    );
};

export default LoadingSpinner;
