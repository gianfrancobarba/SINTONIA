import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { User, Mail, MapPin, IdCard, Calendar, Award, Flag, UserCog, X, Save, Edit2, Loader2, Hash, Users } from 'lucide-react';
import type { PatientData } from '../types/patient';
import { getPatientDetails, updatePatient } from '../services/patient.service';
import { fetchAllPsychologists, type PsychologistOption } from '../services/psychologist.service';
import Toast from './Toast';

interface AdminPatientDetailModalProps {
    patient: PatientData | null;
    onClose: () => void;
    onUpdate?: () => void; // Callback to refresh list after update
}

const AdminPatientDetailModal: React.FC<AdminPatientDetailModalProps> = ({
    patient,
    onClose,
    onUpdate,
}) => {
    const [patientDetails, setPatientDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Psychologists list
    const [psychologists, setPsychologists] = useState<PsychologistOption[]>([]);
    const [loadingPsychologists, setLoadingPsychologists] = useState(false);

    // Editable fields
    const [editedEmail, setEditedEmail] = useState('');
    const [editedResidenza, setEditedResidenza] = useState('');
    const [editedPsicologo, setEditedPsicologo] = useState('');
    const [psychologistSearch, setPsychologistSearch] = useState('');
    const [showPsychologistDropdown, setShowPsychologistDropdown] = useState(false);

    useEffect(() => {
        if (patient) {
            loadPatientDetails();
            loadPsychologists();
        }
    }, [patient]);

    const loadPsychologists = async () => {
        setLoadingPsychologists(true);
        try {
            const data = await fetchAllPsychologists();
            setPsychologists(data);
        } catch (error) {
            console.error('Error loading psychologists:', error);
        } finally {
            setLoadingPsychologists(false);
        }
    };

    const loadPatientDetails = async () => {
        if (!patient) return;

        setLoading(true);
        try {
            const details = await getPatientDetails(patient.idPaziente);
            setPatientDetails(details);
            // Initialize editable fields
            setEditedEmail(details.email || '');
            setEditedResidenza(details.residenza || '');
            setEditedPsicologo(details.idPsicologo || '');
        } catch (error) {
            console.error('Error loading patient details:', error);
            setToast({ message: 'Errore nel caricamento dei dettagli del paziente', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!patient || !patientDetails) return;

        setIsSaving(true);
        try {
            await updatePatient(patient.idPaziente, {
                email: editedEmail,
                residenza: editedResidenza,
                idPsicologo: editedPsicologo,
            });
            setToast({ message: 'Paziente aggiornato con successo!', type: 'success' });
            setIsEditing(false);
            // Reload details
            await loadPatientDetails();
            // Notify parent to refresh list
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error updating patient:', error);
            setToast({ message: 'Errore nell\'aggiornamento del paziente', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset to original values
        if (patientDetails) {
            setEditedEmail(patientDetails.email || '');
            setEditedResidenza(patientDetails.residenza || '');
            setEditedPsicologo(patientDetails.idPsicologo || '');
        }
        setPsychologistSearch('');
        setShowPsychologistDropdown(false);
        setIsEditing(false);
    };

    const handlePsychologistSelect = (codFiscale: string) => {
        setEditedPsicologo(codFiscale);
        setPsychologistSearch('');
        setShowPsychologistDropdown(false);
    };

    const filteredPsychologists = psychologists.filter(psy =>
        psy.codFiscale.toLowerCase().includes(psychologistSearch.toLowerCase()) ||
        `${psy.nome} ${psy.cognome}`.toLowerCase().includes(psychologistSearch.toLowerCase())
    );

    if (!patient) return null;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return dateString;
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(4px)' }}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '1100px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}
            >
                {/* Modern Header with Gradient */}
                <div style={{
                    background: 'linear-gradient(135deg, #0D475D 0%, #1a5f7a 50%, #83B9C1 100%)',
                    padding: '32px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-10%',
                        width: '300px',
                        height: '300px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '50%',
                        filter: 'blur(40px)'
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{
                                    margin: '0 0 8px 0',
                                    fontSize: '28px',
                                    fontWeight: '700',
                                    color: 'white',
                                    letterSpacing: '-0.5px'
                                }}>
                                    Dettagli Paziente
                                </h2>
                                <p style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontWeight: '500'
                                }}>
                                    {patientDetails ? `${patientDetails.nome} ${patientDetails.cognome}` : ''}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(10px)',
                                    border: 'none',
                                    color: 'white',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    fontSize: '20px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                                    e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                    e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body with Modern Cards */}
                <div style={{
                    padding: '32px',
                    background: '#f8f9fa',
                    maxHeight: 'calc(90vh - 200px)',
                    overflowY: 'auto'
                }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
                            <p style={{ marginTop: '16px' }}>Caricamento dettagli...</p>
                        </div>
                    ) : patientDetails ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '16px'
                        }}>
                            {/* ID Paziente Card */}
                            <InfoCard
                                icon={<Hash size={20} />}
                                label="ID Paziente"
                                value={`${patientDetails.idPaziente.substring(0, 16)}...`}
                                iconColor="#0D475D"
                                tooltip={patientDetails.idPaziente}
                            />

                            {/* Nome Card */}
                            <InfoCard
                                icon={<User size={20} />}
                                label="Nome"
                                value={patientDetails.nome}
                                iconColor="#83B9C1"
                            />

                            {/* Cognome Card */}
                            <InfoCard
                                icon={<User size={16} />}
                                label="Cognome"
                                value={patientDetails.cognome}
                                iconColor="#83B9C1"
                            />

                            {/* Codice Fiscale Card */}
                            <InfoCard
                                icon={<IdCard size={16} />}
                                label="Codice Fiscale"
                                value={patientDetails.codFiscale}
                                iconColor="#0D475D"
                            />

                            {/* Data di Nascita Card */}
                            <InfoCard
                                icon={<Calendar size={16} />}
                                label="Data di Nascita"
                                value={formatDate(patientDetails.dataNascita)}
                                iconColor="#7FB77E"
                            />

                            {/* Data Ingresso Card */}
                            <InfoCard
                                icon={<Calendar size={16} />}
                                label="Data Ingresso"
                                value={formatDate(patientDetails.dataIngresso)}
                                iconColor="#7FB77E"
                            />

                            {/* Sesso Card */}
                            <InfoCard
                                icon={<Users size={16} />}
                                label="Sesso"
                                value={patientDetails.sesso}
                                iconColor="#5a9aa5"
                            />

                            {/* Score Card */}
                            <InfoCard
                                icon={<Award size={16} />}
                                label="Score"
                                value={patientDetails.score !== null ? String(patientDetails.score) : 'N/A'}
                                iconColor="#FFB74D"
                            />

                            {/* Priorità Card */}
                            <InfoCard
                                icon={<Flag size={16} />}
                                label="Priorità"
                                value={patientDetails.idPriorita || 'N/A'}
                                iconColor="#E57373"
                            />

                            {/* Residenza Card - Editable */}
                            <EditableCard
                                icon={<MapPin size={16} />}
                                label="Residenza"
                                value={patientDetails.residenza}
                                iconColor="#5a9aa5"
                                isEditing={isEditing}
                                editedValue={editedResidenza}
                                onValueChange={setEditedResidenza}
                            />

                            {/* Psicologo Assegnato Card - Full Width & Editable with Dropdown */}
                            <div style={{
                                gridColumn: '1 / -1',
                                background: 'white',
                                borderRadius: '12px',
                                padding: '14px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                                border: '1px solid #e8e8e8',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                zIndex: isEditing ? 10 : 1
                            }}
                                onMouseEnter={(e) => {
                                    if (!isEditing) {
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isEditing) {
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #7FB77E 0%, #5fa05d 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <UserCog size={16} />
                                    </div>
                                    <span style={{
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        color: '#666',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Psicologo Assegnato
                                    </span>
                                </div>
                                {isEditing ? (
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={psychologistSearch}
                                            onChange={(e) => {
                                                setPsychologistSearch(e.target.value);
                                                setShowPsychologistDropdown(true);
                                            }}
                                            onFocus={(e) => {
                                                setShowPsychologistDropdown(true);
                                                e.target.style.borderColor = '#7FB77E';
                                            }}
                                            placeholder={
                                                editedPsicologo
                                                    ? psychologists.find(p => p.codFiscale === editedPsicologo)
                                                        ? `${psychologists.find(p => p.codFiscale === editedPsicologo)!.codFiscale} - Dr. ${psychologists.find(p => p.codFiscale === editedPsicologo)!.nome} ${psychologists.find(p => p.codFiscale === editedPsicologo)!.cognome}`
                                                        : 'Non assegnato'
                                                    : 'Cerca psicologo...'
                                            }
                                            disabled={loadingPsychologists}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '2px solid #e0e0e0',
                                                borderRadius: '10px',
                                                fontSize: '15px',
                                                fontWeight: '500',
                                                transition: 'all 0.2s ease',
                                                outline: 'none'
                                            }}
                                            onBlur={(e) => {
                                                setTimeout(() => {
                                                    e.target.style.borderColor = '#e0e0e0';
                                                    setShowPsychologistDropdown(false);
                                                }, 200);
                                            }}
                                        />

                                        {showPsychologistDropdown && !loadingPsychologists && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                right: 0,
                                                marginTop: '8px',
                                                backgroundColor: 'white',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '12px',
                                                maxHeight: '200px',
                                                overflowY: 'auto',
                                                zIndex: 9999,
                                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                                            }}>
                                                {/* Non assegnato option */}
                                                <div
                                                    onClick={() => handlePsychologistSelect('')}
                                                    style={{
                                                        padding: '12px 16px',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        fontWeight: '500',
                                                        borderBottom: '1px solid #f0f0f0',
                                                        color: '#999',
                                                        fontStyle: 'italic',
                                                        backgroundColor: editedPsicologo === '' ? '#f0f9f0' : 'white'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (editedPsicologo !== '') {
                                                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (editedPsicologo !== '') {
                                                            e.currentTarget.style.backgroundColor = 'white';
                                                        }
                                                    }}
                                                >
                                                    -- Non assegnato --
                                                </div>

                                                {filteredPsychologists.length > 0 ? (
                                                    filteredPsychologists.map(psy => (
                                                        <div
                                                            key={psy.codFiscale}
                                                            onClick={() => handlePsychologistSelect(psy.codFiscale)}
                                                            style={{
                                                                padding: '12px 16px',
                                                                cursor: 'pointer',
                                                                borderBottom: '1px solid #f0f0f0',
                                                                fontSize: '13px',
                                                                backgroundColor: editedPsicologo === psy.codFiscale ? '#e8f5e9' : 'white',
                                                                transition: 'background-color 0.2s ease'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                if (editedPsicologo !== psy.codFiscale) {
                                                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                                                }
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                if (editedPsicologo !== psy.codFiscale) {
                                                                    e.currentTarget.style.backgroundColor = 'white';
                                                                }
                                                            }}
                                                        >
                                                            <div style={{ fontWeight: 500, color: '#333' }}>{psy.codFiscale}</div>
                                                            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                                                Dr. {psy.nome} {psy.cognome}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div style={{
                                                        padding: '20px',
                                                        textAlign: 'center',
                                                        color: '#999',
                                                        fontSize: '13px'
                                                    }}>
                                                        Nessun psicologo trovato
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {!showPsychologistDropdown && editedPsicologo && (
                                            <span style={{
                                                fontSize: '11px',
                                                color: '#7FB77E',
                                                display: 'block',
                                                marginTop: '6px',
                                                fontWeight: '500'
                                            }}>
                                                ✓ Selezionato: {psychologists.find(p => p.codFiscale === editedPsicologo)?.codFiscale || 'Non assegnato'}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <p style={{
                                        margin: 0,
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#1a1a1a'
                                    }}>
                                        {patientDetails.nomePsicologo || 'Non assegnato'}
                                    </p>
                                )}
                            </div>

                            {/* Email Card - Full Width & Editable */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <EditableCard
                                    icon={<Mail size={16} />}
                                    label="Email"
                                    value={patientDetails.email}
                                    iconColor="#5a9aa5"
                                    isEditing={isEditing}
                                    editedValue={editedEmail}
                                    onValueChange={setEditedEmail}
                                    type="email"
                                />
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            Errore nel caricamento dei dettagli
                        </div>
                    )}
                </div>

                {/* Modern Footer */}
                <div style={{
                    padding: '24px 32px',
                    background: 'white',
                    borderTop: '1px solid #e8e8e8',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                }}>
                    {!loading && patientDetails && (
                        <>
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        style={{
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            border: '2px solid #e0e0e0',
                                            background: 'white',
                                            color: '#666',
                                            cursor: isSaving ? 'not-allowed' : 'pointer',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSaving) {
                                                e.currentTarget.style.background = '#f8f9fa';
                                                e.currentTarget.style.borderColor = '#d0d0d0';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'white';
                                            e.currentTarget.style.borderColor = '#e0e0e0';
                                        }}
                                    >
                                        <X size={18} />
                                        Annulla
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        style={{
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #7FB77E 0%, #5fa05d 100%)',
                                            color: 'white',
                                            cursor: isSaving ? 'not-allowed' : 'pointer',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: '0 4px 12px rgba(127, 183, 126, 0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSaving) {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(127, 183, 126, 0.4)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(127, 183, 126, 0.3)';
                                        }}
                                    >
                                        <Save size={18} />
                                        {isSaving ? 'Salvataggio...' : 'Salva Modifiche'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #83B9C1 0%, #5a9aa5 100%)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 4px 12px rgba(131, 185, 193, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(131, 185, 193, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(131, 185, 193, 0.3)';
                                    }}
                                >
                                    <Edit2 size={18} />
                                    Modifica
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>,
        document.body
    );
};

// Info Card Component
const InfoCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    iconColor: string;
    tooltip?: string;
}> = ({ icon, label, value, iconColor, tooltip }) => {
    return (
        <div
            style={{
                background: 'white',
                borderRadius: '12px',
                padding: '14px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e8e8e8',
                transition: 'all 0.3s ease'
            }}
            title={tooltip}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${iconColor} 0%, ${iconColor}dd 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    {icon}
                </div>
                <span style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {label}
                </span>
            </div>
            <p style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a1a1a'
            }}>
                {value}
            </p>
        </div>
    );
};

// Editable Card Component
const EditableCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    iconColor: string;
    isEditing: boolean;
    editedValue: string;
    onValueChange: (value: string) => void;
    type?: string;
}> = ({ icon, label, value, iconColor, isEditing, editedValue, onValueChange, type = 'text' }) => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '14px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e8e8e8',
            transition: 'all 0.3s ease'
        }}
            onMouseEnter={(e) => {
                if (!isEditing) {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isEditing) {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${iconColor} 0%, ${iconColor}dd 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    {icon}
                </div>
                <span style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {label}
                </span>
            </div>
            {isEditing ? (
                <input
                    type={type}
                    value={editedValue}
                    onChange={(e) => onValueChange(e.target.value)}
                    placeholder={value}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = iconColor}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
            ) : (
                <p style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a1a1a'
                }}>
                    {value}
                </p>
            )}
        </div>
    );
};

export default AdminPatientDetailModal;
