import React from 'react';
import { Trash2 } from 'lucide-react';
import '../css/DeletePsychologistConfirmModal.css';

interface DeletePsychologistConfirmModalProps {
    isOpen: boolean;
    psychologistName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting: boolean;
}

const DeletePsychologistConfirmModal: React.FC<DeletePsychologistConfirmModalProps> = ({
    isOpen,
    psychologistName,
    onConfirm,
    onCancel,
    isDeleting
}) => {
    if (!isOpen) return null;

    return (
        <div className="delete-psychologist-overlay" onClick={onCancel}>
            <div className="delete-psychologist-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="delete-psychologist-header">
                    <div className="delete-psychologist-icon">
                        <Trash2 size={24} />
                    </div>
                    <h3>Conferma Eliminazione</h3>
                </div>
                <p className="delete-psychologist-message">
                    Sei sicuro di voler eliminare lo psicologo <strong>{psychologistName}</strong>?
                </p>
                <p className="delete-psychologist-warning">
                    ⚠️ Questa azione è irreversibile e rimuoverà permanentemente lo psicologo dal sistema.
                </p>
                <div className="delete-psychologist-actions">
                    <button
                        className="psychologist-cancel-button"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        Annulla
                    </button>
                    <button
                        className="psychologist-confirm-delete-button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Eliminazione...' : 'Elimina'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeletePsychologistConfirmModal;
