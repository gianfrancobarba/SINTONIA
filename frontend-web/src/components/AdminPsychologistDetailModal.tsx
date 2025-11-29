import React, { useState } from 'react';
import { Search, User, Mail, Building2, IdCard, Edit2, Save, X } from 'lucide-react';
import '../css/QuestionnaireDetailModal.css';
import { updatePsychologist } from '../services/psychologist.service';
import Toast from './Toast';

interface PsychologistData {
    codiceFiscale: string;
    nome: string;
    cognome: string;
    aslAppartenenza: string;
    email: string;
}

interface AdminPsychologistDetailModalProps {
    psychologist: PsychologistData | null;
    onClose: () => void;
    onUpdate?: (updatedData?: Partial<PsychologistData>) => void;
}

const ASL_OPTIONS = [
    'NA-1',
    'NA-2',
    'NA-3',
    'SA-1',
    'SA-2',
    'SA-3',
    'AV-1',
    'AV-2',
    'BN-1',
    'CE-1',
    'CE-2',
];

const AdminPsychologistDetailModal: React.FC<AdminPsychologistDetailModalProps> = ({
    psychologist,
    onClose,
    onUpdate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedEmail, setEditedEmail] = useState(psychologist?.email || '');
    const [editedAsl, setEditedAsl] = useState(psychologist?.aslAppartenenza || '');
    const [aslSearch, setAslSearch] = useState('');
    const [showAslDropdown, setShowAslDropdown] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    React.useEffect(() => {
        if (psychologist) {
            setEditedEmail(psychologist.email);
            setEditedAsl(psychologist.aslAppartenenza);
        }
    }, [psychologist]);

    const handleSave = async () => {
        if (!psychologist) return;
        setIsSaving(true);

        try {
            await updatePsychologist(psychologist.codiceFiscale, {
                email: editedEmail,
                aslAppartenenza: editedAsl
            });

            setToast({
                message: 'Dati dello psicologo aggiornati con successo!',
                type: 'success'
            });
            setIsSaving(false);
            setIsEditing(false);

            if (onUpdate) {
                onUpdate({
                    email: editedEmail,
                    aslAppartenenza: editedAsl
                });
            }
            // Non chiudiamo il modale subito per mostrare il toast e i dati aggiornati
        } catch (error) {
            console.error('Failed to update psychologist:', error);
            setToast({
                message: 'Si è verificato un errore durante l\'aggiornamento. Riprova più tardi.',
                type: 'error'
            });
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (psychologist) {
            setEditedEmail(psychologist.email);
            setEditedAsl(psychologist.aslAppartenenza);
        }
        setAslSearch('');
        setShowAslDropdown(false);
        setIsEditing(false);
    };

    const handleAslSelect = (asl: string) => {
        setEditedAsl(asl);
        setAslSearch('');
        setShowAslDropdown(false);
    };

    const filteredAslOptions = ASL_OPTIONS.filter(asl =>
        asl.toLowerCase().includes(aslSearch.toLowerCase())
    );

    if (!psychologist) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(4px)' }}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '700px',
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
                                    Dettagli Psicologo
                                </h2>
                                <p style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontWeight: '500'
                                }}>
                                    {psychologist.nome} {psychologist.cognome}
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
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px'
                    }}>
                        {/* Codice Fiscale Card */}
                        <InfoCard
                            icon={<IdCard size={20} />}
                            label="Codice Fiscale"
                            value={psychologist.codiceFiscale}
                            iconColor="#0D475D"
                        />

                        {/* Nome Card */}
                        <InfoCard
                            icon={<User size={20} />}
                            label="Nome"
                            value={psychologist.nome}
                            iconColor="#83B9C1"
                        />

                        {/* Cognome Card */}
                        <InfoCard
                            icon={<User size={20} />}
                            label="Cognome"
                            value={psychologist.cognome}
                            iconColor="#83B9C1"
                        />

                        {/* ASL Card */}
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #e8e8e8',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            zIndex: 10
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #7FB77E 0%, #5fa05d 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <Building2 size={20} />
                                </div>
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#666',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    ASL Appartenenza
                                </span>
                            </div>
                            {isEditing ? (
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={aslSearch}
                                            onChange={(e) => {
                                                setAslSearch(e.target.value);
                                                setShowAslDropdown(true);
                                            }}
                                            onFocus={(e) => {
                                                setShowAslDropdown(true);
                                                e.target.style.borderColor = '#7FB77E';
                                            }}
                                            placeholder={editedAsl || 'Cerca ASL...'}
                                            style={{
                                                width: '100%',
                                                padding: '12px 40px 12px 16px',
                                                border: '2px solid #e0e0e0',
                                                borderRadius: '10px',
                                                fontSize: '15px',
                                                fontWeight: '500',
                                                transition: 'all 0.2s ease',
                                                outline: 'none'
                                            }}
                                            onBlur={(e) => setTimeout(() => e.target.style.borderColor = '#e0e0e0', 200)}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'none',
                                            color: '#7FB77E'
                                        }}>
                                            <Search size={18} />
                                        </div>
                                    </div>

                                    {showAslDropdown && (
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
                                            {filteredAslOptions.length > 0 ? (
                                                filteredAslOptions.map(asl => (
                                                    <div
                                                        key={asl}
                                                        onClick={() => handleAslSelect(asl)}
                                                        style={{
                                                            padding: '12px 16px',
                                                            cursor: 'pointer',
                                                            fontSize: '14px',
                                                            fontWeight: '500',
                                                            backgroundColor: editedAsl === asl ? '#f0f9f0' : 'white',
                                                            transition: 'background-color 0.2s ease',
                                                            color: editedAsl === asl ? '#7FB77E' : '#333'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (editedAsl !== asl) {
                                                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (editedAsl !== asl) {
                                                                e.currentTarget.style.backgroundColor = 'white';
                                                            }
                                                        }}
                                                    >
                                                        {asl}
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{
                                                    padding: '20px',
                                                    textAlign: 'center',
                                                    color: '#999',
                                                    fontSize: '13px'
                                                }}>
                                                    Nessuna ASL trovata
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {!showAslDropdown && editedAsl && (
                                        <span style={{
                                            fontSize: '11px',
                                            color: '#7FB77E',
                                            display: 'block',
                                            marginTop: '6px',
                                            fontWeight: '500'
                                        }}>
                                            ✓ Selezionato: {editedAsl}
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
                                    {psychologist.aslAppartenenza}
                                </p>
                            )}
                        </div>

                        {/* Email Card - Full Width */}
                        <div style={{
                            gridColumn: '1 / -1',
                            background: 'white',
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #e8e8e8',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            zIndex: 1
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #5a9aa5 0%, #4a8a95 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <Mail size={20} />
                                </div>
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#666',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Email
                                </span>
                            </div>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editedEmail}
                                    onChange={(e) => setEditedEmail(e.target.value)}
                                    placeholder="email@example.com"
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
                                    onFocus={(e) => e.target.style.borderColor = '#5a9aa5'}
                                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                />
                            ) : (
                                <p style={{
                                    margin: 0,
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#1a1a1a'
                                }}>
                                    {psychologist.email}
                                </p>
                            )}
                        </div>
                    </div>
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
                </div>
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div >
    );
};

// Info Card Component
const InfoCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    iconColor: string;
}> = ({ icon, label, value, iconColor }) => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e8e8e8',
            transition: 'all 0.3s ease'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${iconColor} 0%, ${iconColor}dd 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    {icon}
                </div>
                <span style={{
                    fontSize: '12px',
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
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a'
            }}>
                {value}
            </p>
        </div>
    );
};

export default AdminPsychologistDetailModal;
