import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import '../css/ChangePasswordModal.css';

interface ChangePasswordModalProps {
    onClose: () => void;
    onConfirm: (newPassword: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, onConfirm }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validazione
        if (!password || !confirmPassword) {
            setError('Tutti i campi sono obbligatori');
            return;
        }

        if (password.length < 8) {
            setError('La password deve essere di almeno 8 caratteri');
            return;
        }

        if (password !== confirmPassword) {
            setError('Le password non corrispondono');
            return;
        }

        // Se tutto ok, chiama onConfirm
        onConfirm(password);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Modifica Password</h2>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Chiudi">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Nuova Password */}
                    <div className="form-group">
                        <label className="form-label">Nuova Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                className="form-control"
                                placeholder="Inserisci la nuova password"
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Conferma Password */}
                    <div className="form-group">
                        <label className="form-label">Conferma Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError('');
                                }}
                                className="form-control"
                                placeholder="Reinserisci la nuova password"
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? 'Nascondi password' : 'Mostra password'}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Annulla
                        </button>
                        <button type="submit" className="btn-primary">
                            Conferma
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
