import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User } from 'lucide-react';
import profilePhoto from '../images/psychologist-photo.png';
import '../css/PsychologistPersonalArea.css';
import { getProfile, updateProfile } from '../services/psychologist.service';
import { getCurrentUser } from '../services/auth.service';
import type { OutletContextType } from './AppLayout';
import PageHeader from './PageHeader';

import Toast from './Toast';

/**
 * Compress image using Canvas API
 * @param file - Original image file
 * @param maxSize - Max width/height in pixels (default 200)
 * @param quality - JPEG quality 0-1 (default 0.7)
 * @returns Promise with base64 data URL
 */
const compressImage = (file: File, maxSize = 200, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // Calculate new dimensions maintaining aspect ratio
                if (width > height) {
                    if (width > maxSize) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                const base64 = canvas.toDataURL('image/jpeg', quality);
                resolve(base64);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

const PsychologistPersonalArea: React.FC = () => {
    const { onProfileUpdate } = useOutletContext<OutletContextType>();
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
        profileImageBase64?: string | null;
    }>({
        codiceFiscale: '',
        nome: '',
        cognome: '',
        asl: '',
        email: '',
        profileImageUrl: profilePhoto,
        profileImageBase64: null
    });
    const [originalData, setOriginalData] = useState(formData);

    useEffect(() => {
        const loadData = async () => {
            try {
                const user = getCurrentUser();
                const cf = user?.fiscalCode || user?.id || user?.email;
                if (cf) {
                    const data = await getProfile(cf);
                    // Handle base64 or URL
                    let imageUrl = profilePhoto;
                    if (data.immagineProfilo) {
                        if (data.immagineProfilo.startsWith('data:')) {
                            // Base64 image
                            imageUrl = data.immagineProfilo;
                        } else if (data.immagineProfilo.startsWith('http')) {
                            imageUrl = data.immagineProfilo;
                        } else {
                            // Legacy: filename - serve from uploads
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
                        profileImageBase64: null
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
        setEmailError('');
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
                    immagineProfilo: formData.profileImageBase64 || undefined
                });

                // Refresh data or update state
                setOriginalData({ ...formData, profileImageBase64: null });
                setIsEditing(false);
                setToast({ message: 'Dati salvati con successo!', type: 'success' });

                // Notify parent to refresh profile
                onProfileUpdate();
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressedBase64 = await compressImage(file, 200, 0.7);
                setFormData({
                    ...formData,
                    profileImageUrl: compressedBase64,
                    profileImageBase64: compressedBase64
                });
            } catch (error) {
                console.error('Error compressing image:', error);
                setToast({ message: 'Errore durante la compressione dell\'immagine', type: 'error' });
            }
        }
    };

    return (
        <div className="personal-area-container">
            <PageHeader
                title="Area Personale"
                subtitle="Gestisci il tuo profilo"
                icon={<User size={24} />}
            />

            <div className="personal-area-content">
                <div className="personal-area-layout-vertical">
                    {/* Top: Profile Photo */}
                    <div className="profile-photo-center">
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
                                    <span>Cambia</span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Bottom: Form Fields */}
                    <div className="profile-fields-section">
                        <div className="fields-row">
                            <div className="form-field">
                                <label className="field-label">Nome</label>
                                <input type="text" value={formData.nome} disabled className="field-input field-disabled" />
                            </div>
                            <div className="form-field">
                                <label className="field-label">Cognome</label>
                                <input type="text" value={formData.cognome} disabled className="field-input field-disabled" />
                            </div>
                        </div>
                        <div className="fields-row">
                            <div className="form-field">
                                <label className="field-label">Codice Fiscale</label>
                                <input type="text" value={formData.codiceFiscale} disabled className="field-input field-disabled" />
                            </div>
                            <div className="form-field">
                                <label className="field-label">ASL</label>
                                <input type="text" value={formData.asl} disabled className="field-input field-disabled" />
                            </div>
                        </div>
                        <div className="fields-row">
                            <div className="form-field field-email-wrapper" style={{ flex: 1 }}>
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
                                    <div className="email-error-message">
                                        {emailError}
                                    </div>
                                )}
                            </div>
                            <div className="form-actions-inline">
                                {!isEditing ? (
                                    <button className="btn-edit" onClick={handleEdit}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Modifica
                                    </button>
                                ) : (
                                    <div className="btn-group">
                                        <button className="btn-cancel" onClick={handleCancel}>Annulla</button>
                                        <button className="btn-save" onClick={handleSave}>Salva</button>
                                    </div>
                                )}
                            </div>
                        </div>
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
