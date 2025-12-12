import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { User, Flag, UserCog, X, Save, Edit2, Loader2, Trash2, ChevronDown, Check, PenLine } from 'lucide-react';
import type { PatientData } from '../types/patient';
import { getPatientDetails, updatePatient, removePatientFromWaitingList, updatePatientPriority, searchComuni } from '../services/patient.service';
import { fetchAllPsychologists, type PsychologistOption } from '../services/psychologist.service';
import Toast from './Toast';
import '../css/Modal.css';

interface AdminPatientDetailModalProps {
    patient: PatientData | null;
    onClose: () => void;
    onUpdate?: () => void;
}

const PRIORITY_OPTIONS = [
    { value: 'Urgente', label: 'Urgente' },
    { value: 'Breve', label: 'Breve' },
    { value: 'Differibile', label: 'Differibile' },
    { value: 'Programmabile', label: 'Programmabile' }
];

const AdminPatientDetailModal: React.FC<AdminPatientDetailModalProps> = ({
    patient,
    onClose,
    onUpdate,
}) => {
    const [patientDetails, setPatientDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Psychologists list
    const [psychologists, setPsychologists] = useState<PsychologistOption[]>([]);
    // Removed unused loadingPsychologists variable

    // Editable fields
    const [editedEmail, setEditedEmail] = useState('');
    const [tempEmail, setTempEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [editedResidenza, setEditedResidenza] = useState('');
    const [isValidResidence, setIsValidResidence] = useState(true);
    const [editedPsicologo, setEditedPsicologo] = useState('');
    const [editedPriorita, setEditedPriorita] = useState('');
    const [comuniOptions, setComuniOptions] = useState<{ nome: string; provincia: string; codice: string }[]>([]);
    const [psychologistSearch, setPsychologistSearch] = useState('');
    const [showPsychologistDropdown, setShowPsychologistDropdown] = useState(false);

    // Chip dropdown states
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showResidenzaInput, setShowResidenzaInput] = useState(false);
    const [showEmailInput, setShowEmailInput] = useState(false);

    const psychologistDropdownRef = useRef<HTMLDivElement>(null);
    const priorityDropdownRef = useRef<HTMLDivElement>(null);
    const residenzaInputRef = useRef<HTMLDivElement>(null);
    const emailInputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (psychologistDropdownRef.current && !psychologistDropdownRef.current.contains(event.target as Node)) {
                setShowPsychologistDropdown(false);
            }
            if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target as Node)) {
                setShowPriorityDropdown(false);
            }
            if (residenzaInputRef.current && !residenzaInputRef.current.contains(event.target as Node)) {
                setShowResidenzaInput(false);
            }
            if (emailInputRef.current && !emailInputRef.current.contains(event.target as Node)) {
                setShowEmailInput(false);
            }
        }

        if (showPsychologistDropdown || showPriorityDropdown || showResidenzaInput || showEmailInput) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPsychologistDropdown, showPriorityDropdown, showResidenzaInput, showEmailInput]);

    useEffect(() => {
        if (patient) {
            loadPatientDetails();
            loadPsychologists();
        }
    }, [patient]);

    const loadPsychologists = async () => {
        try {
            const data = await fetchAllPsychologists();
            setPsychologists(data);
        } catch (error) {
            console.error('Error loading psychologists:', error);
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
            setEditedPriorita(details.idPriorita || '');
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
            // Update basic fields (email, residenza, psicologo)
            await updatePatient(patient.idPaziente, {
                email: editedEmail,
                residenza: editedResidenza,
                idPsicologo: editedPsicologo,
            });

            // Update priority separately if changed
            if (editedPriorita !== patientDetails.idPriorita) {
                await updatePatientPriority(patient.idPaziente, editedPriorita);
            }

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
            setEditedPriorita(patientDetails.idPriorita || '');
        }
        setPsychologistSearch('');
        setShowPsychologistDropdown(false);
        setIsEditing(false);
    };

    const handleRemoveFromWaitingList = () => {
        if (!patient || !patientDetails) return;
        setShowConfirmModal(true);
    };

    const confirmRemove = async () => {
        if (!patient || !patientDetails) return;

        setIsRemoving(true);
        try {
            await removePatientFromWaitingList(patient.idPaziente);
            setToast({
                message: `${patientDetails.nome} ${patientDetails.cognome} è stato rimosso dalla lista d'attesa con successo!`,
                type: 'success'
            });
            setShowConfirmModal(false);
            setIsEditing(false);
            // Notify parent to refresh list
            if (onUpdate) {
                onUpdate();
            }
            // Close modal after short delay
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error: any) {
            console.error('Error removing patient:', error);
            const errorMessage = error.response?.data?.message || 'Errore nella rimozione del paziente dalla lista d\'attesa';
            setToast({ message: errorMessage, type: 'error' });
            setShowConfirmModal(false);
        } finally {
            setIsRemoving(false);
        }
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
        <div className="modal-overlay-blur" onClick={onClose}>
            <div
                className="modal-card modal-card-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Gradient */}
                <div className="modal-header-gradient">
                    <div className="modal-header-content">
                        <div className="modal-header-text">
                            <h2 className="modal-header-title">
                                Dettagli Paziente
                            </h2>
                            <p className="modal-header-subtitle">
                                {patientDetails ? `${patientDetails.nome} ${patientDetails.cognome}` : ''}
                            </p>
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
                <div className="modal-body-gray modal-body-scrollable">
                    {loading ? (
                        <div className="modal-loading">
                            <Loader2 size={32} className="modal-loading-spinner" />
                            <p style={{ marginTop: '16px' }}>Caricamento dettagli...</p>
                        </div>
                    ) : patientDetails ? (
                        <div>
                            {/* Compact Info Section */}
                            <div className="modal-data-section">
                                <div className="modal-data-section-title">
                                    <div className="modal-data-section-title-icon">
                                        <User size={14} />
                                    </div>
                                    Informazioni Paziente
                                </div>

                                <div className="modal-data-row">
                                    <div className="modal-data-row-dot modal-data-row-dot-teal"></div>
                                    <span className="modal-data-row-label">ID Paziente</span>
                                    <span className="modal-data-row-value" title={patientDetails.idPaziente}>
                                        {patientDetails.idPaziente.length > 20
                                            ? `${patientDetails.idPaziente.substring(0, 20)}...`
                                            : patientDetails.idPaziente}
                                    </span>
                                </div>

                                <div className="modal-data-row">
                                    <div className="modal-data-row-dot modal-data-row-dot-cyan"></div>
                                    <span className="modal-data-row-label">Nome</span>
                                    <span className="modal-data-row-value">{patientDetails.nome}</span>
                                </div>

                                <div className="modal-data-row">
                                    <div className="modal-data-row-dot modal-data-row-dot-cyan"></div>
                                    <span className="modal-data-row-label">Cognome</span>
                                    <span className="modal-data-row-value">{patientDetails.cognome}</span>
                                </div>

                                <div className="modal-data-row">
                                    <div className="modal-data-row-dot modal-data-row-dot-teal"></div>
                                    <span className="modal-data-row-label">Codice Fiscale</span>
                                    <span className="modal-data-row-value">{patientDetails.codFiscale}</span>
                                </div>

                                {/* Psicologo - Editable Chip (only if already assigned) */}
                                <div className="modal-data-row modal-data-row-editable">
                                    <div className="modal-data-row-dot modal-data-row-dot-purple"></div>
                                    <span className="modal-data-row-label">Psicologo</span>
                                    <div style={{ position: 'relative' }} ref={psychologistDropdownRef}>
                                        <button
                                            onClick={() => {
                                                // Only allow editing if patient already has a psychologist
                                                if (isEditing && patientDetails.idPsicologo) {
                                                    setShowPsychologistDropdown(!showPsychologistDropdown);
                                                }
                                            }}
                                            className="modal-editable-chip"
                                            style={{
                                                cursor: isEditing && patientDetails.idPsicologo ? 'pointer' : 'default',
                                                opacity: isEditing && patientDetails.idPsicologo ? 1 : 0.7,
                                                paddingRight: '12px'
                                            }}
                                        >
                                            {editedPsicologo ? (
                                                <span style={{ fontWeight: 600 }}>
                                                    {psychologists.find(p => p.codFiscale === editedPsicologo)
                                                        ? `Dr. ${psychologists.find(p => p.codFiscale === editedPsicologo)!.cognome}`
                                                        : editedPsicologo}
                                                </span>
                                            ) : 'Non assegnato'}
                                            {isEditing && patientDetails.idPsicologo && <UserCog size={14} className="modal-editable-chip-icon" style={{ marginLeft: '6px' }} />}
                                        </button>

                                        {showPsychologistDropdown && (
                                            <div className="modal-chip-input-popover" style={{ width: '300px', zIndex: 10001 }}>
                                                <input
                                                    type="text"
                                                    value={psychologistSearch}
                                                    onChange={(e) => setPsychologistSearch(e.target.value)}
                                                    placeholder="Cerca per nome o ID..."
                                                    className="modal-chip-input"
                                                    autoFocus
                                                    style={{ marginBottom: '10px' }}
                                                />

                                                <div style={{ maxHeight: '140px', overflowY: 'auto' }}>
                                                    {/* Non assegnato option */}
                                                    <div
                                                        onClick={() => handlePsychologistSelect('')}
                                                        className="modal-chip-dropdown-option"
                                                        style={{ fontStyle: 'italic', color: '#666' }}
                                                    >
                                                        -- Non assegnato --
                                                    </div>

                                                    {filteredPsychologists.length > 0 ? (
                                                        filteredPsychologists.map(psy => (
                                                            <div
                                                                key={psy.codFiscale}
                                                                onClick={() => handlePsychologistSelect(psy.codFiscale)}
                                                                className={`modal-chip-dropdown-option ${editedPsicologo === psy.codFiscale ? 'modal-chip-dropdown-option-selected' : ''}`}
                                                            >
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                                                                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{psy.cognome} {psy.nome}</span>
                                                                    <span style={{ fontSize: '11px', color: '#64748b' }}>{psy.codFiscale}</span>
                                                                </div>
                                                                {editedPsicologo === psy.codFiscale && (
                                                                    <div className="modal-chip-dropdown-option-check">
                                                                        <Check size={12} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div style={{ padding: '12px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
                                                            Nessuno psicologo trovato
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Priorità - Editable Chip */}
                                <div className="modal-data-row modal-data-row-editable">
                                    <div className="modal-data-row-dot modal-data-row-dot-red"></div>
                                    <span className="modal-data-row-label">Priorità</span>
                                    <div style={{ position: 'relative' }} ref={priorityDropdownRef}>
                                        <button
                                            onClick={() => isEditing && setShowPriorityDropdown(!showPriorityDropdown)}
                                            className={`modal-editable-chip modal-editable-chip-priority-${(editedPriorita || patientDetails.idPriorita || '').toLowerCase()}`}
                                            style={{ cursor: isEditing ? 'pointer' : 'default', opacity: isEditing ? 1 : 0.8 }}
                                        >
                                            {editedPriorita || patientDetails.idPriorita || 'N/A'}
                                            {isEditing && <ChevronDown size={14} className="modal-editable-chip-icon" />}
                                        </button>

                                        {showPriorityDropdown && (
                                            <div className="modal-chip-dropdown">
                                                {PRIORITY_OPTIONS.map(option => {
                                                    const isSelected = (editedPriorita || patientDetails.idPriorita) === option.value;
                                                    const colors: Record<string, string> = {
                                                        'Urgente': '#ef4444',
                                                        'Breve': '#f97316',
                                                        'Differibile': '#eab308',
                                                        'Programmabile': '#22c55e'
                                                    };
                                                    return (
                                                        <div
                                                            key={option.value}
                                                            onClick={() => {
                                                                setEditedPriorita(option.value);
                                                                setShowPriorityDropdown(false);
                                                            }}
                                                            className={`modal-chip-dropdown-option ${isSelected ? 'modal-chip-dropdown-option-selected' : ''}`}
                                                        >
                                                            <div
                                                                className="modal-chip-dropdown-option-icon"
                                                                style={{ background: colors[option.value] }}
                                                            >
                                                                <Flag size={14} />
                                                            </div>
                                                            <span className="modal-chip-dropdown-option-label">{option.label}</span>
                                                            {isSelected && (
                                                                <div className="modal-chip-dropdown-option-check">
                                                                    <Check size={12} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Residenza - Editable Chip with Autocomplete */}
                                <div className="modal-data-row modal-data-row-editable">
                                    <div className="modal-data-row-dot modal-data-row-dot-teal"></div>
                                    <span className="modal-data-row-label">Residenza</span>
                                    <div style={{ position: 'relative' }} ref={residenzaInputRef}>
                                        <button
                                            onClick={() => {
                                                if (isEditing) {
                                                    setEditedResidenza(patientDetails.residenza || '');
                                                    setIsValidResidence(true); // Assume current is valid initially
                                                    setShowResidenzaInput(!showResidenzaInput);
                                                }
                                            }}
                                            className="modal-editable-chip"
                                            style={{ cursor: isEditing ? 'pointer' : 'default', opacity: isEditing ? 1 : 0.8 }}
                                        >
                                            {editedResidenza || patientDetails.residenza || 'N/A'}
                                            {isEditing && <PenLine size={12} className="modal-editable-chip-icon" />}
                                        </button>

                                        {showResidenzaInput && (
                                            <div className="modal-chip-input-popover" style={{ width: '280px', zIndex: 10002 }}>
                                                <input
                                                    type="text"
                                                    value={editedResidenza} // Used as search term
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setEditedResidenza(val);
                                                        setIsValidResidence(false); // Invalid while typing unless selected
                                                        // Trigger search
                                                        if (val.length >= 2) {
                                                            searchComuni(val).then(setComuniOptions).catch(console.error);
                                                        } else {
                                                            setComuniOptions([]);
                                                        }
                                                    }}
                                                    placeholder="Cerca comune..."
                                                    className="modal-chip-input"
                                                    autoFocus
                                                />
                                                {/* Suggestions List */}
                                                {comuniOptions.length > 0 && (
                                                    <div style={{
                                                        maxHeight: '150px',
                                                        overflowY: 'auto',
                                                        border: '1px solid #eee',
                                                        borderTop: 'none',
                                                        borderRadius: '0 0 8px 8px',
                                                        marginTop: '4px',
                                                        background: 'white',
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                    }}>
                                                        {comuniOptions.map((comune) => (
                                                            <div
                                                                key={comune.codice}
                                                                onClick={() => {
                                                                    setEditedResidenza(`${comune.nome} (${comune.provincia})`);
                                                                    setIsValidResidence(true); // Valid selection
                                                                    setComuniOptions([]); // Close suggestions
                                                                    // We keep the popover open until user clicks OK or Cancel
                                                                }}
                                                                style={{
                                                                    padding: '8px 12px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '13px',
                                                                    borderBottom: '1px solid #f0f0f0'
                                                                }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                                                            >
                                                                <span style={{ fontWeight: 500 }}>{comune.nome}</span>
                                                                <span style={{ color: '#64748b', fontSize: '11px', marginLeft: '4px' }}>({comune.provincia})</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="modal-chip-input-actions" style={{ marginTop: '8px' }}>
                                                    <button
                                                        onClick={() => {
                                                            // Revert to original if cancelled
                                                            setEditedResidenza(patientDetails.residenza || '');
                                                            setShowResidenzaInput(false);
                                                        }}
                                                        className="modal-chip-btn modal-chip-btn-cancel"
                                                    >
                                                        Annulla
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowResidenzaInput(false);
                                                            setComuniOptions([]);
                                                        }}
                                                        disabled={!isValidResidence}
                                                        className="modal-chip-btn modal-chip-btn-save"
                                                        style={{ opacity: isValidResidence ? 1 : 0.5, cursor: isValidResidence ? 'pointer' : 'not-allowed' }}
                                                    >
                                                        <Check size={14} /> OK
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Email - Editable Chip */}
                                <div className="modal-data-row modal-data-row-editable">
                                    <div className="modal-data-row-dot modal-data-row-dot-cyan"></div>
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
                                            {editedEmail || patientDetails.email || 'N/A'}
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
                                    <div className="modal-data-row-dot modal-data-row-dot-green"></div>
                                    <span className="modal-data-row-label">Data di Nascita</span>
                                    <span className="modal-data-row-value">{formatDate(patientDetails.dataNascita)}</span>
                                </div>

                                <div className="modal-data-row">
                                    <div className="modal-data-row-dot modal-data-row-dot-green"></div>
                                    <span className="modal-data-row-label">Data Ingresso</span>
                                    <span className="modal-data-row-value">{formatDate(patientDetails.dataIngresso)}</span>
                                </div>

                                <div className="modal-data-row">
                                    <div className="modal-data-row-dot modal-data-row-dot-cyan"></div>
                                    <span className="modal-data-row-label">Sesso</span>
                                    <span className="modal-data-row-value">{patientDetails.sesso}</span>
                                </div>

                                <div className="modal-data-row">
                                    <div className="modal-data-row-dot modal-data-row-dot-orange"></div>
                                    <span className="modal-data-row-label">Score</span>
                                    <span className="modal-data-row-value modal-data-row-value-highlight">
                                        {patientDetails.score !== null ? patientDetails.score : 'N/A'}
                                    </span>
                                </div>




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
                                    <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                                        <button
                                            onClick={handleRemoveFromWaitingList}
                                            disabled={!patientDetails.stato || isSaving || isRemoving}
                                            style={{
                                                padding: '12px 24px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                background: !patientDetails.stato
                                                    ? 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)'
                                                    : 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                                color: 'white',
                                                cursor: (!patientDetails.stato || isSaving || isRemoving) ? 'not-allowed' : 'pointer',
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                boxShadow: !patientDetails.stato
                                                    ? '0 4px 12px rgba(158, 158, 158, 0.3)'
                                                    : '0 4px 12px rgba(220, 53, 69, 0.3)',
                                                opacity: (!patientDetails.stato || isSaving || isRemoving) ? 0.6 : 1
                                            }}
                                            onMouseEnter={(e) => {
                                                if (patientDetails.stato && !isSaving && !isRemoving) {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (patientDetails.stato) {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)';
                                                }
                                            }}
                                            title={!patientDetails.stato ? 'Il paziente è già stato rimosso dalla lista d\'attesa' : ''}
                                        >
                                            <Trash2 size={18} />
                                            {isRemoving ? 'Rimozione...' : 'Rimuovi dalla Lista d\'Attesa'}
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving || isRemoving}
                                        style={{
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            border: '2px solid #e0e0e0',
                                            background: 'white',
                                            color: '#666',
                                            cursor: (isSaving || isRemoving) ? 'not-allowed' : 'pointer',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSaving && !isRemoving) {
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
                                        disabled={isSaving || isRemoving}
                                        style={{
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #7FB77E 0%, #5fa05d 100%)',
                                            color: 'white',
                                            cursor: (isSaving || isRemoving) ? 'not-allowed' : 'pointer',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: '0 4px 12px rgba(127, 183, 126, 0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSaving && !isRemoving) {
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

            {showConfirmModal && ReactDOM.createPortal(
                <div className="alerts-overlay" role="dialog" aria-modal="true" aria-labelledby="alerts-overlay-title">
                    <div className="alerts-overlay-backdrop" onClick={() => setShowConfirmModal(false)} />
                    <div className="alerts-overlay-card" role="document">
                        <h3 id="alerts-overlay-title" className="overlay-title">Conferma rimozione</h3>
                        <p className="overlay-text">
                            Sei sicuro di voler rimuovere {patientDetails?.nome} {patientDetails?.cognome} dalla lista d'attesa?
                        </p>
                        <p className="overlay-id">
                            <strong>ID Paziente:</strong> {patient?.idPaziente}
                        </p>
                        <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic', marginTop: '8px' }}>
                            Questa azione imposterà lo stato del paziente come non attivo.
                        </p>
                        <div className="overlay-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowConfirmModal(false)}
                                disabled={isRemoving}
                            >
                                Annulla
                            </button>
                            <button
                                className="confirm-btn"
                                onClick={confirmRemove}
                                disabled={isRemoving}
                                style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' }}
                            >
                                {isRemoving ? 'Rimozione...' : 'Conferma Rimozione'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>,
        document.body
    );
};

export default AdminPatientDetailModal;
