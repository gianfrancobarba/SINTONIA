import React, { useState, useEffect } from 'react';
import type { PatientData } from '../types/patient';
import { getPatientDetails, updatePatient } from '../services/patient.service';
import { fetchAllPsychologists, type PsychologistOption } from '../services/psychologist.service';
import '../css/QuestionnaireDetailModal.css'; // Reuse existing styles

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

    // Psychologists list
    const [psychologists, setPsychologists] = useState<PsychologistOption[]>([]);
    const [loadingPsychologists, setLoadingPsychologists] = useState(false);

    // Editable fields
    const [editedEmail, setEditedEmail] = useState('');
    const [editedResidenza, setEditedResidenza] = useState('');
    const [editedPsicologo, setEditedPsicologo] = useState('');
    const [psychologistSearch, setPsychologistSearch] = useState('');

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
            alert('Errore nel caricamento dei dettagli del paziente');
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
            alert('Paziente aggiornato con successo!');
            setIsEditing(false);
            // Reload details
            await loadPatientDetails();
            // Notify parent to refresh list
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error updating patient:', error);
            alert('Errore nell\'aggiornamento del paziente');
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
        setIsEditing(false);
    };

    if (!patient) return null;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return dateString;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2 className="modal-title">Dettagli Paziente</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Chiudi">
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            Caricamento dettagli...
                        </div>
                    ) : patientDetails ? (
                        <>
                            {/* Main Info Section */}
                            <div className="questionnaire-info">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>ID Paziente:</label>
                                        <span title={patientDetails.idPaziente}>
                                            {patientDetails.idPaziente.substring(0, 16)}...
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <label>Nome Completo:</label>
                                        <span>{patientDetails.nome} {patientDetails.cognome}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Codice Fiscale:</label>
                                        <span>{patientDetails.codFiscale}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Email:</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editedEmail}
                                                onChange={(e) => setEditedEmail(e.target.value)}
                                                style={{
                                                    padding: '6px 10px',
                                                    border: '2px solid #7FB77E',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    width: '100%'
                                                }}
                                            />
                                        ) : (
                                            <span>{patientDetails.email}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Data di Nascita:</label>
                                        <span>{formatDate(patientDetails.dataNascita)}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Data Ingresso:</label>
                                        <span>{formatDate(patientDetails.dataIngresso)}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Residenza:</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedResidenza}
                                                onChange={(e) => setEditedResidenza(e.target.value)}
                                                style={{
                                                    padding: '6px 10px',
                                                    border: '2px solid #7FB77E',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    width: '100%'
                                                }}
                                            />
                                        ) : (
                                            <span>{patientDetails.residenza}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Sesso:</label>
                                        <span>{patientDetails.sesso}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Psicologo Assegnato:</label>
                                        {isEditing ? (
                                            <div style={{ position: 'relative', width: '100%' }}>
                                                {/* Search/Display Input */}
                                                <input
                                                    type="text"
                                                    value={psychologistSearch}
                                                    onChange={(e) => setPsychologistSearch(e.target.value)}
                                                    onFocus={() => setPsychologistSearch('')}
                                                    placeholder={
                                                        editedPsicologo
                                                            ? psychologists.find(p => p.codFiscale === editedPsicologo)
                                                                ? `${psychologists.find(p => p.codFiscale === editedPsicologo)!.codFiscale} - Dr. ${psychologists.find(p => p.codFiscale === editedPsicologo)!.nome} ${psychologists.find(p => p.codFiscale === editedPsicologo)!.cognome}`
                                                                : 'Non assegnato'
                                                            : '🔍 Cerca per codice fiscale o nome...'
                                                    }
                                                    disabled={loadingPsychologists}
                                                    className="modal-input"
                                                    style={{
                                                        fontSize: '13px',
                                                        padding: '8px 12px',
                                                    }}
                                                />

                                                {/* Dropdown List */}
                                                {psychologistSearch && !loadingPsychologists && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        left: 0,
                                                        right: 0,
                                                        marginTop: '4px',
                                                        backgroundColor: 'white',
                                                        border: '2px solid #E0E0E0',
                                                        borderRadius: '6px',
                                                        maxHeight: '200px',
                                                        overflowY: 'auto',
                                                        zIndex: 1000,
                                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                                    }}>
                                                        {/* Non assegnato option */}
                                                        <div
                                                            onClick={() => {
                                                                setEditedPsicologo('');
                                                                setPsychologistSearch('');
                                                            }}
                                                            style={{
                                                                padding: '10px 12px',
                                                                cursor: 'pointer',
                                                                borderBottom: '1px solid #f0f0f0',
                                                                fontSize: '13px',
                                                                color: '#999',
                                                                fontStyle: 'italic'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                                        >
                                                            -- Non assegnato --
                                                        </div>

                                                        {/* Filtered psychologists */}
                                                        {psychologists
                                                            .filter(psy =>
                                                                psy.codFiscale.toLowerCase().includes(psychologistSearch.toLowerCase()) ||
                                                                `${psy.nome} ${psy.cognome}`.toLowerCase().includes(psychologistSearch.toLowerCase())
                                                            )
                                                            .map(psy => (
                                                                <div
                                                                    key={psy.codFiscale}
                                                                    onClick={() => {
                                                                        setEditedPsicologo(psy.codFiscale);
                                                                        setPsychologistSearch('');
                                                                    }}
                                                                    style={{
                                                                        padding: '10px 12px',
                                                                        cursor: 'pointer',
                                                                        borderBottom: '1px solid #f0f0f0',
                                                                        fontSize: '13px',
                                                                        backgroundColor: editedPsicologo === psy.codFiscale ? '#e8f5e9' : 'white'
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
                                                                    <div style={{ fontWeight: 500, color: '#333' }}>
                                                                        {psy.codFiscale}
                                                                    </div>
                                                                    <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                                                        Dr. {psy.nome} {psy.cognome}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }

                                                        {/* No results message */}
                                                        {psychologists.filter(psy =>
                                                            psy.codFiscale.toLowerCase().includes(psychologistSearch.toLowerCase()) ||
                                                            `${psy.nome} ${psy.cognome}`.toLowerCase().includes(psychologistSearch.toLowerCase())
                                                        ).length === 0 && (
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

                                                {/* Loading indicator */}
                                                {loadingPsychologists && (
                                                    <span style={{
                                                        fontSize: '12px',
                                                        color: '#7FB77E',
                                                        fontStyle: 'italic',
                                                        display: 'block',
                                                        marginTop: '4px'
                                                    }}>
                                                        ⏳ Caricamento psicologi...
                                                    </span>
                                                )}

                                                {/* Helper text */}
                                                {!loadingPsychologists && !psychologistSearch && psychologists.length > 0 && (
                                                    <span style={{
                                                        fontSize: '11px',
                                                        color: '#999',
                                                        display: 'block',
                                                        marginTop: '4px'
                                                    }}>
                                                        {editedPsicologo
                                                            ? `Selezionato: ${psychologists.find(p => p.codFiscale === editedPsicologo)?.codFiscale || 'Non assegnato'}`
                                                            : `${psychologists.length} psicologi disponibili`
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span>{patientDetails.nomePsicologo || 'Non assegnato'}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Score:</label>
                                        <span className="score-value">
                                            {patientDetails.score !== null ? patientDetails.score : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <label>Priorità:</label>
                                        <span>{patientDetails.idPriorita || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            Errore nel caricamento dei dettagli
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {!loading && patientDetails && (
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '6px',
                                            border: '1px solid #ddd',
                                            background: '#fff',
                                            cursor: isSaving ? 'not-allowed' : 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: '#7FB77E',
                                            color: '#fff',
                                            cursor: isSaving ? 'not-allowed' : 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {isSaving ? 'Salvataggio...' : 'Salva Modifiche'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: '#83B9C1',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ✏️ Modifica
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPatientDetailModal;
