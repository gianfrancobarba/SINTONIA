import React, { useState, useEffect } from 'react';
import profilePhoto from '../images/psychologist-photo.png';
import '../css/PsychologistPersonalArea.css';
import { getProfile, updateProfile } from '../services/psychologist.service';
import { getCurrentUser } from '../services/auth.service';

interface PsychologistPersonalAreaProps {
    onProfileUpdate?: () => void;
}

import Toast from './Toast';

const PsychologistPersonalArea: React.FC<PsychologistPersonalAreaProps> = ({ onProfileUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState<{
        codiceFiscale: string;
        nome: string;
        cognome: string;
        asl: string;
        email: string;
        profileImageUrl: string;
        profileImageFile?: File | null;
    }>({
        codiceFiscale: '',
        nome: '',
        cognome: '',
        asl: '',
        email: '',
        profileImageUrl: profilePhoto,
        profileImageFile: null
    });
    const [originalData, setOriginalData] = useState(formData);

    useEffect(() => {
        const loadData = async () => {
            try {
                const user = getCurrentUser();
                const cf = user?.fiscalCode || user?.id || user?.email;
                if (cf) {
                    const data = await getProfile(cf);
                    // Construct full URL if it's a filename
                    let imageUrl = profilePhoto;
                    if (data.immagineProfilo) {
                        if (data.immagineProfilo.startsWith('http')) {
                            imageUrl = data.immagineProfilo;
                        } else {
                            // Assuming backend serves uploads at /uploads/
                            imageUrl = `http://localhost:3000/uploads/${data.immagineProfilo}`;
                        }
                    }

                    const mappedData = {
                        codiceFiscale: data.codFiscale,
                        nome: data.nome,
                        cognome: data.cognome,
                        asl: data.aslAppartenenza,
                        email: data.email,
                        profileImageUrl: imageUrl,
                        profileImageFile: null
                    };
                    setFormData(mappedData);
                    setOriginalData(mappedData);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        };
        loadData();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setOriginalData(formData);
    };

    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
    };

    const handleSave = async () => {
        // Email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            setEmailError('Email non valida');
            return;
        }
        setEmailError('');

        try {
            const user = getCurrentUser();
            const cf = user?.fiscalCode || user?.email;
            if (cf) {
                await updateProfile(cf, {
                    email: formData.email,
                    immagineProfilo: formData.profileImageFile
                });

                // Refresh data or update state
                setOriginalData({ ...formData, profileImageFile: null });
                setIsEditing(false);
                setToast({ message: 'Dati salvati con successo!', type: 'success' });

                // Notify parent to refresh profile
                if (onProfileUpdate) {
                    onProfileUpdate();
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setToast({ message: 'Errore durante il salvataggio dei dati', type: 'error' });
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, email: e.target.value });
        setEmailError(''); // Clear error when user types
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    profileImageUrl: reader.result as string,
                    profileImageFile: file
                });
            };
            reader.readAsDataURL(file);
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
                            src={formData.profileImageUrl}
                            alt="Foto profilo psicologo"
                            className="profile-image-preview"
                            onError={(e) => {
                                e.currentTarget.src = profilePhoto;
                            }}
                        />
                        {isEditing && (
                            <label className="image-upload-overlay">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Cambia foto</span>
                            </label>
                        )}
                    </div>
                </div>

                {/* Form Fields */}
                <div className="form-section">
                    <div className="form-row form-row-double">
                        <div className="form-field">
                            <label className="field-label">Codice Fiscale</label>
                            <input
                                type="text"
                                value={formData.codiceFiscale}
                                disabled
                                className="field-input field-disabled"
                            />
                        </div>
                        <div className="form-field">
                            <label className="field-label">ASL di Appartenenza</label>
                            <input
                                type="text"
                                value={formData.asl}
                                disabled
                                className="field-input field-disabled"
                            />
                        </div>
                    </div>

                    <div className="form-row form-row-double">
                        <div className="form-field">
                            <label className="field-label">Nome</label>
                            <input
                                type="text"
                                value={formData.nome}
                                disabled
                                className="field-input field-disabled"
                            />
                        </div>
                        <div className="form-field">
                            <label className="field-label">Cognome</label>
                            <input
                                type="text"
                                value={formData.cognome}
                                disabled
                                className="field-input field-disabled"
                            />
                        </div>
                    </div>

                    <div className="form-row-centered">
                        <div className="form-field">
                            <label className="field-label">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={handleEmailChange}
                                disabled={!isEditing}
                                className={`field-input ${isEditing ? 'field-editable' : 'field-disabled'}`}
                                style={{ borderColor: emailError ? '#ef4444' : undefined }}
                            />
                            {emailError && (
                                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', fontWeight: 500 }}>
                                    {emailError}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons Footer */}
                    <div className="form-actions">
                        {!isEditing ? (
                            <button className="btn-edit" onClick={handleEdit}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Modifica
                            </button>
                        ) : (
                            <div className="btn-group">
                                <button className="btn-cancel" onClick={handleCancel}>
                                    Annulla
                                </button>
                                <button className="btn-save" onClick={handleSave}>
                                    Salva
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
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

export default PsychologistPersonalArea;
