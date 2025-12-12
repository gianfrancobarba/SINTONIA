import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../css/ConfirmDeleteModal.css';

interface ConfirmDeleteModalProps {
    isOpen?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen = true,
    onConfirm,
    onCancel,
    title = "Conferma eliminazione",
    message = "Sei sicuro di voler procedere?",
    confirmText = "Elimina",
    cancelText = "Annulla"
}) => {
    // Blocca lo scroll quando il modal è aperto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCancel = () => {
        onCancel();
    };

    const handleConfirm = () => {
        onConfirm();
    };

    // Usa un portale per renderizzare il modal direttamente nel body
    // Questo evita problemi di posizionamento con container parent
    return ReactDOM.createPortal(
        <div
            className="confirm-modal-overlay"
            onClick={onCancel}
        >
            <div
                className="confirm-modal-box"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="confirm-modal-title">{title}</h2>
                <p className="confirm-modal-message">{message}</p>
                <div className="confirm-modal-buttons">
                    <button
                        className="confirm-modal-btn cancel-btn"
                        onClick={handleCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="confirm-modal-btn delete-btn"
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmDeleteModal;
