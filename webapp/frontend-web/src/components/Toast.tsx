import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import '../css/Toast.css';

export interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300); // Match animation duration
    };

    return (
        <div className="toast-container">
            <div className={`toast ${type} ${isClosing ? 'closing' : ''}`}>
                <div className="toast-icon">
                    {type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                </div>
                <div className="toast-content">
                    <div className="toast-title">
                        {type === 'success' ? 'Successo' : 'Errore'}
                    </div>
                    <div className="toast-message">{message}</div>
                </div>
                <button className="toast-close" onClick={handleClose}>
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
