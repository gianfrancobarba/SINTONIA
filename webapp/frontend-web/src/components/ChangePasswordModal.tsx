import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Eye, EyeOff, X } from 'lucide-react';
import '../css/Modal.css';

interface ChangePasswordModalProps {
    onClose: () => void;
    onConfirm: (oldPassword: string, newPassword: string) => Promise<void>;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, onConfirm }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validazione client-side
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('Tutti i campi sono obbligatori');
            return;
        }

        if (newPassword.length < 8) {
            setError('La password deve essere di almeno 8 caratteri');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Le due password non coincidono');
            return;
        }

        // Chiamata async al backend
        try {
            await onConfirm(oldPassword, newPassword);
            onClose(); // Chiude solo se successo
        } catch (error: any) {
            // Mostra errore dal backend sotto il campo password attuale
            const errorMessage = error.response?.data?.message || 'Errore durante la modifica della password';
            setError(errorMessage);
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay-blur" onClick={onClose}>
            <div className="modal-card modal-card-sm" onClick={(e) => e.stopPropagation()}>
                {/* Header with Gradient */}
                <div className="modal-header-gradient">
                    <div className="modal-header-content">
                        <div className="modal-header-text">
                            <h2 className="modal-header-title">
                                Modifica Password
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="modal-close-btn-rounded"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="modal-body-white">
                    {/* Password Vecchia */}
                    <div className="modal-form-group" style={{ marginBottom: '20px' }}>
                        <label className="modal-form-label">
                            Password Attuale
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                value={oldPassword}
                                onChange={(e) => {
                                    setOldPassword(e.target.value);
                                    setError('');
                                }}
                                className="modal-form-input"
                                placeholder="Inserisci la password attuale"
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#83B9C1',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                aria-label={showOldPassword ? 'Nascondi password' : 'Mostra password'}
                            >
                                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Nuova Password */}
                    <div className="modal-form-group" style={{ marginBottom: '20px' }}>
                        <label className="modal-form-label">
                            Nuova Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setError('');
                                }}
                                className="modal-form-input"
                                placeholder="Inserisci la nuova password"
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#83B9C1',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                aria-label={showNewPassword ? 'Nascondi password' : 'Mostra password'}
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Conferma Password */}
                    <div className="modal-form-group" style={{ marginBottom: '20px' }}>
                        <label className="modal-form-label">
                            Conferma Nuova Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError('');
                                }}
                                className="modal-form-input"
                                placeholder="Reinserisci la nuova password"
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#83B9C1',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                aria-label={showConfirmPassword ? 'Nascondi password' : 'Mostra password'}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="modal-error-box">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="modal-footer-actions" style={{ marginTop: '24px', padding: 0, border: 'none' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-modal-secondary"
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            className="btn-modal-primary"
                        >
                            Conferma
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default ChangePasswordModal;

