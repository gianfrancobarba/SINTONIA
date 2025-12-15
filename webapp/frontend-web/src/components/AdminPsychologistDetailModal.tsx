import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { User, Edit2, Save, X, Check, PenLine, ChevronDown, AlertTriangle, UserMinus } from 'lucide-react';
import '../css/Modal.css';
import { updatePsychologist, deletePsychologist } from '../services/psychologist.service';
import Toast from './Toast';

interface PsychologistData {
    codiceFiscale: string;
    nome: string;
    cognome: string;
    aslAppartenenza: string;
    email: string;
    stato?: boolean | 'Attivo' | 'Inattivo'; // Supporta sia boolean che string
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

    // Editable fields state
    const [editedEmail, setEditedEmail] = useState(psychologist?.email || '');
    const [tempEmail, setTempEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const [editedAsl, setEditedAsl] = useState(psychologist?.aslAppartenenza || '');
    const [aslSearch, setAslSearch] = useState('');
    const [showAslDropdown, setShowAslDropdown] = useState(false);
    const [showEmailInput, setShowEmailInput] = useState(false); // Add this for consistency

    // Refs for click outside
    const emailInputRef = React.useRef<HTMLDivElement>(null);
    const aslDropdownRef = React.useRef<HTMLDivElement>(null);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    React.useEffect(() => {
        if (psychologist) {
            setEditedEmail(psychologist.email);
            setEditedAsl(psychologist.aslAppartenenza);
        }
    }, [psychologist]);

    // Click outside handler
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emailInputRef.current && !emailInputRef.current.contains(event.target as Node)) {
                setShowEmailInput(false);
            }
            if (aslDropdownRef.current && !aslDropdownRef.current.contains(event.target as Node)) {
                setShowAslDropdown(false);
            }
        }

        if (showEmailInput || showAslDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmailInput, showAslDropdown]);

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

    const handleDelete = async () => {
        if (!psychologist) return;
        setIsDeleting(true);

        try {
            await deletePsychologist(psychologist.codiceFiscale);
            setToast({
                message: 'Psicologo eliminato con successo!',
                type: 'success'
            });

            setTimeout(() => {
                onClose();
                if (onUpdate) onUpdate();
            }, 1500);
        } catch (error: any) {
            setToast({
                message: error.message || 'Errore durante l\'eliminazione',
                type: 'error'
            });
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleActivate = async () => {
        if (!psychologist) return;
        setIsActivating(true);

        try {
            // Usa l'endpoint di modifica per impostare stato = true
            await updatePsychologist(psychologist.codiceFiscale, {
                email: psychologist.email,
                aslAppartenenza: psychologist.aslAppartenenza,
                stato: true // <-- Riattiva lo psicologo
            } as any);

            setToast({
                message: 'Psicologo riattivato con successo!',
                type: 'success'
            });

            setTimeout(() => {
                if (onUpdate) {
                    // Aggiorna locale stato a 'Attivo'
                    onUpdate({ stato: 'Attivo' as any });
                }
            }, 500);
        } catch (error: any) {
            setToast({
                message: error.message || 'Errore durante la riattivazione',
                type: 'error'
            });
        } finally {
            setIsActivating(false);
        }
    };

    // Helper: determina se lo psicologo è inattivo (supporta boolean e string)
    const isInactive = psychologist?.stato === false || psychologist?.stato === 'Inattivo';

    const filteredAslOptions = ASL_OPTIONS.filter(asl =>
        asl.toLowerCase().includes(aslSearch.toLowerCase())
    );

    if (!psychologist) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay-blur" onClick={onClose}>
            <div
                className="modal-card modal-card-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Gradient */}
                <div className="modal-header-gradient">
                    <div className="modal-header-content">
                        <div className="modal-header-text">
                            <h2 className="modal-header-title">
                                Dettagli Psicologo
                            </h2>
                            <p className="modal-header-subtitle">
                                Dr. {psychologist.nome} {psychologist.cognome}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="modal-close-btn-rounded"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="modal-body-gray modal-body-scrollable">
                    <div className="modal-data-section">
                        <div className="modal-data-section-title">
                            <div className="modal-data-section-title-icon">
                                <User size={14} />
                            </div>
                            Informazioni Psicologo
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot modal-data-row-dot-teal"></div>
                            <span className="modal-data-row-label">Codice Fiscale</span>
                            <span className="modal-data-row-value">{psychologist.codiceFiscale}</span>
                        </div>


                        {/* ASL Appartenenza - Editable Chip */}
                        <div className="modal-data-row modal-data-row-editable">
                            <div className="modal-data-row-dot modal-data-row-dot-green"></div>
                            <span className="modal-data-row-label">ASL Appartenenza</span>
                            <div style={{ position: 'relative' }} ref={aslDropdownRef}>
                                <button
                                    onClick={() => isEditing && setShowAslDropdown(!showAslDropdown)}
                                    className="modal-editable-chip"
                                    style={{ cursor: isEditing ? 'pointer' : 'default', opacity: isEditing ? 1 : 0.8 }}
                                >
                                    {editedAsl || psychologist.aslAppartenenza || 'N/A'}
                                    {isEditing && <ChevronDown size={14} className="modal-editable-chip-icon" />}
                                </button>

                                {showAslDropdown && (
                                    <div className="modal-chip-dropdown">
                                        <div style={{ padding: '8px' }}>
                                            <input
                                                type="text"
                                                value={aslSearch}
                                                onChange={(e) => setAslSearch(e.target.value)}
                                                placeholder="Cerca ASL..."
                                                className="modal-chip-input"
                                                autoFocus
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <div style={{ maxHeight: '140px', overflowY: 'auto' }}>
                                            {filteredAslOptions.length > 0 ? (
                                                filteredAslOptions.map(asl => (
                                                    <div
                                                        key={asl}
                                                        onClick={() => handleAslSelect(asl)}
                                                        className={`modal-chip-dropdown-option ${editedAsl === asl ? 'modal-chip-dropdown-option-selected' : ''}`}
                                                    >
                                                        <div className="modal-chip-dropdown-option-label">{asl}</div>
                                                        {editedAsl === asl && (
                                                            <div className="modal-chip-dropdown-option-check">
                                                                <Check size={12} />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ padding: '12px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
                                                    Nessuna ASL trovata
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email - Editable Chip */}
                        <div className="modal-data-row modal-data-row-editable">
                            <div className="modal-data-row-dot modal-data-row-dot-teal"></div>
                            <span className="modal-data-row-label">Email</span>
                            <div style={{ position: 'relative' }} ref={emailInputRef}>
                                <button
                                    onClick={() => {
                                        if (isEditing) {
                                            setTempEmail(editedEmail);
                                            setEmailError('');
                                            setShowEmailInput(!showEmailInput);
                                        }
                                    }}
                                    className="modal-editable-chip"
                                    style={{ cursor: isEditing ? 'pointer' : 'default', opacity: isEditing ? 1 : 0.8 }}
                                >
                                    {editedEmail || psychologist.email || 'N/A'}
                                    {isEditing && <PenLine size={12} className="modal-editable-chip-icon" />}
                                </button>

                                {showEmailInput && (
                                    <div className="modal-chip-input-popover">
                                        <input
                                            type="email"
                                            value={tempEmail}
                                            onChange={(e) => {
                                                setTempEmail(e.target.value);
                                                setEmailError('');
                                            }}
                                            placeholder="Inserisci email..."
                                            className="modal-chip-input"
                                            autoFocus
                                            style={{ borderColor: emailError ? '#ef4444' : undefined }}
                                        />
                                        {emailError && (
                                            <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '6px', fontWeight: 500 }}>
                                                {emailError}
                                            </div>
                                        )}
                                        <div className="modal-chip-input-actions">
                                            <button
                                                onClick={() => setShowEmailInput(false)}
                                                className="modal-chip-btn modal-chip-btn-cancel"
                                            >
                                                Annulla
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Robust email regex: Standard chars @ Standard domain . TLD (min 2 chars)
                                                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                                                    if (!tempEmail || emailRegex.test(tempEmail)) {
                                                        setEditedEmail(tempEmail);
                                                        setShowEmailInput(false);
                                                    } else {
                                                        setEmailError('Email non valida');
                                                    }
                                                }}
                                                className="modal-chip-btn modal-chip-btn-save"
                                            >
                                                <Check size={14} /> OK
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot modal-data-row-dot-cyan"></div>
                            <span className="modal-data-row-label">Nome</span>
                            <span className="modal-data-row-value">{psychologist.nome}</span>
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot modal-data-row-dot-cyan"></div>
                            <span className="modal-data-row-label">Cognome</span>
                            <span className="modal-data-row-value">{psychologist.cognome}</span>
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
                        <>
                            {/* Se inattivo: mostra Attiva (verde) */}
                            {isInactive ? (
                                <button
                                    onClick={handleActivate}
                                    disabled={isActivating}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        cursor: isActivating ? 'not-allowed' : 'pointer',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                        opacity: isActivating ? 0.7 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActivating) {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActivating) {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                                        }
                                    }}
                                >
                                    <Check size={18} />
                                    {isActivating ? 'Attivazione...' : 'Attiva'}
                                </button>
                            ) : (
                                /* Se attivo: mostra Elimina (rosso o grigio se già eliminato) */
                                <button
                                    onClick={() => !isInactive && setShowDeleteConfirm(true)}
                                    disabled={isInactive}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: isInactive
                                            ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        color: 'white',
                                        cursor: isInactive ? 'not-allowed' : 'pointer',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s ease',
                                        boxShadow: isInactive
                                            ? '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            : '0 4px 12px rgba(239, 68, 68, 0.3)',
                                        opacity: isInactive ? 0.6 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isInactive) {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isInactive) {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                        }
                                    }}
                                >
                                    <UserMinus size={18} />
                                    {isInactive ? 'Già Disattivato' : 'Disattiva'}
                                </button>
                            )}

                            {/* Pulsante Modifica - sempre presente */}<button
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
                        </>
                    )}
                </div>
            </div>

            {/* Modale Conferma Eliminazione */}
            {showDeleteConfirm && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000
                    }}
                    onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '32px',
                            maxWidth: '480px',
                            width: '90%',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px'
                            }}>
                                <AlertTriangle size={32} color="#dc2626" />
                            </div>
                            <h3 style={{
                                margin: '0 0 12px 0',
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#1a1a1a'
                            }}>
                                Conferma Disattivazione
                            </h3>
                            <p style={{
                                margin: '0 0 8px 0',
                                fontSize: '15px',
                                color: '#666',
                                lineHeight: '1.5'
                            }}>
                                Sei sicuro di voler disattivare lo psicologo:
                            </p>
                            <p style={{
                                margin: '0 0 16px 0',
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#0D475D'
                            }}>
                                {psychologist?.nome} {psychologist?.cognome}
                            </p>
                            <div style={{
                                padding: '12px 16px',
                                background: '#e0f2fe',
                                border: '1px solid #7dd3fc',
                                borderRadius: '10px',
                                fontSize: '13px',
                                color: '#0369a1',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                justifyContent: 'center'
                            }}>
                                Lo psicologo verrà impostato come Inattivo e potrà essere riattivato in seguito
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                style={{
                                    padding: '12px 32px',
                                    borderRadius: '12px',
                                    border: '2px solid #e0e0e0',
                                    background: 'white',
                                    color: '#666',
                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease',
                                    opacity: isDeleting ? 0.5 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!isDeleting) {
                                        e.currentTarget.style.background = '#f8f9fa';
                                        e.currentTarget.style.borderColor = '#d0d0d0';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.borderColor = '#e0e0e0';
                                }}
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                style={{
                                    padding: '12px 32px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: 'white',
                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                                    opacity: isDeleting ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!isDeleting) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                }}
                            >
                                {isDeleting ? 'Disattivazione...' : 'Disattiva'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div >,
        document.body
    );
};



export default AdminPsychologistDetailModal;
