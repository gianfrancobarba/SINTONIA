import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../css/ConfirmDeleteModal.css';

interface ConfirmDeleteModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ onConfirm, onCancel }) => {
    // Blocca lo scroll quando il modal è aperto
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleCancel = () => {
        document.body.style.overflow = 'unset';
        onCancel();
    };

    const handleConfirm = () => {
        document.body.style.overflow = 'unset';
        onConfirm();
    };

    // Usa un portale per renderizzare il modal direttamente nel body
    // Questo evita problemi di posizionamento con container parent
    return ReactDOM.createPortal(
        <div
            className="confirm-modal-overlay"
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="confirm-modal-box"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="confirm-modal-buttons">
                    <button
                        className="confirm-modal-btn cancel-btn"
                        onClick={handleCancel}
                    >
                        Annulla
                    </button>
                    <button
                        className="confirm-modal-btn delete-btn"
                        onClick={handleConfirm}
                    >
                        Elimina
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmDeleteModal;
