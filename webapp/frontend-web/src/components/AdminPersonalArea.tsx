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

    const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
        await changePassword(oldPassword, newPassword);
        setToast({
            message: 'Password modificata con successo!',
            type: 'success'
        });
    };

    return (
        <div className="personal-area-container">
            {/* Hero Banner */}
            <div className="profile-hero-banner" />

            {/* Profile Photo overlapping banner */}
            <div className="profile-photo-container">
                <div className="profile-image-wrapper">
                    <img
                        src={MOCK_ADMIN_DATA.profileImageUrl}
                        alt="Foto profilo"
                        className="profile-image-preview"
                        onError={(e) => {
                            e.currentTarget.src = profilePhoto;
                        }}
                    />
                </div>
                <div className="profile-name-display">
                    <h2>{MOCK_ADMIN_DATA.nome} {MOCK_ADMIN_DATA.cognome}</h2>
                    <p>Amministratore</p>
                </div>
            </div>

            {/* Content with Info Cards */}
            <div className="personal-area-content">
                <div className="info-cards-grid">
                    <div className="info-card">
                        <div className="info-card-label">Nome</div>
                        <div className="info-card-value">{MOCK_ADMIN_DATA.nome}</div>
                    </div>
                    <div className="info-card">
                        <div className="info-card-label">Cognome</div>
                        <div className="info-card-value">{MOCK_ADMIN_DATA.cognome}</div>
                    </div>
                    <div className="info-card full-width">
                        <div className="info-card-label">Email</div>
                        <div className="info-card-value">{MOCK_ADMIN_DATA.email}</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="profile-actions">
                    <button
                        className="change-password-button"
                        onClick={() => setShowPasswordModal(true)}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Modifica Password
                    </button>
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