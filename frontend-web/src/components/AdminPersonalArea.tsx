import React, { useState } from 'react';
import profilePhoto from '../images/psychologist-photo.png';
import ChangePasswordModal from './ChangePasswordModal';
import Toast from './Toast';
import '../css/AdminPersonalArea.css';

import { changePassword } from '../services/auth.service';

// Mock data for admin personal info
const MOCK_ADMIN_DATA = {
    nome: 'Alessio',
    cognome: 'Del Sorbo',
    email: 'alessio.delsorbo@gmail.com',
    profileImageUrl: profilePhoto
};

const AdminPersonalArea: React.FC = () => {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handlePasswordChange = async (newPassword: string) => {
        try {
            await changePassword(newPassword);
            setToast({
                message: 'Password modificata con successo!',
                type: 'success'
            });
        } catch (error) {
            console.error('Error changing password:', error);
            setToast({
                message: 'Errore durante la modifica della password. Riprova.',
                type: 'error'
            });
        }
    };

    return (
        <div className="personal-area-container">
            <div className="personal-area-header">
                <h2 className="personal-area-title">Area Personale</h2>
            </div>

            <div className="personal-area-content">
                {/* Profile Image Section */}
                <div className="profile-image-section">
                    <div className="profile-image-wrapper">
                        <img
                            src={MOCK_ADMIN_DATA.profileImageUrl}
                            alt="Foto profilo admin"
                            className="profile-image-preview"
                            onError={(e) => {
                                e.currentTarget.src = profilePhoto;
                            }}
                        />
                    </div>
                </div>

                {/* Form Fields */}
                <div className="form-section">

                    {/* Nome e Cognome */}
                    <div className="form-row form-row-double">
                        <div className="form-field">
                            <label className="field-label">Nome</label>
                            <input
                                type="text"
                                value={MOCK_ADMIN_DATA.nome}
                                disabled
                                className="field-input field-disabled"
                            />
                        </div>
                        <div className="form-field">
                            <label className="field-label">Cognome</label>
                            <input
                                type="text"
                                value={MOCK_ADMIN_DATA.cognome}
                                disabled
                                className="field-input field-disabled"
                            />
                        </div>
                    </div>

                    {/* Email - Read Only */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="field-label">Email</label>
                            <input
                                type="email"
                                value={MOCK_ADMIN_DATA.email}
                                disabled
                                className="field-input field-disabled"
                            />
                        </div>
                    </div>

                    {/* Password - Button to open modal */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="field-label">Password</label>
                            <button
                                className="change-password-button"
                                onClick={() => setShowPasswordModal(true)}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" />
                                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" />
                                </svg>
                                Modifica Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <ChangePasswordModal
                    onClose={() => setShowPasswordModal(false)}
                    onConfirm={handlePasswordChange}
                />
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default AdminPersonalArea;