import React from 'react';
import type { PatientData } from '../types/patient';
import '../css/QuestionnaireDetailModal.css'; // Reuse existing styles

interface AdminPatientDetailModalProps {
    patient: PatientData | null;
    onClose: () => void;
}

const AdminPatientDetailModal: React.FC<AdminPatientDetailModalProps> = ({
    patient,
    onClose,
}) => {
    if (!patient) return null;

    // Mock data for additional patient details not in PatientData type
    const mockPatientDetails = {
        codiceFiscale: 'RSSMRA80A01H501U',
        telefono: '+39 333 1234567',
        indirizzo: 'Via Roma 123, 00100 Roma',
        statoAccount: 'Attivo',
        termsAccettati: true,
        dataAccettazioneTerms: '2024-11-15',
        numeroQuestionari: 5,
        ultimoAccesso: '2024-11-27',
        note: 'Paziente regolare, nessuna problematica segnalata.',
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return dateString;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2 className="modal-title">Dettagli Paziente (Admin)</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Chiudi">
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <div className="questionnaire-info">
                        <div className="info-grid">
                            <div className="info-item">
                                <label>ID Paziente:</label>
                                <span title={patient.idPaziente}>
                                    {patient.idPaziente.substring(0, 16)}...
                                </span>
                            </div>
                            <div className="info-item">
                                <label>Nome Completo:</label>
                                <span>{patient.nome} {patient.cognome}</span>
                            </div>
                            <div className="info-item">
                                <label>Codice Fiscale:</label>
                                <span>{mockPatientDetails.codiceFiscale}</span>
                            </div>
                            <div className="info-item">
                                <label>Email:</label>
                                <span>{patient.email}</span>
                            </div>
                            <div className="info-item">
                                <label>Telefono:</label>
                                <span>{mockPatientDetails.telefono}</span>
                            </div>
                            <div className="info-item">
                                <label>Data di Nascita:</label>
                                <span>{formatDate(patient.dataNascita)}</span>
                            </div>
                            <div className="info-item">
                                <label>Data Ingresso:</label>
                                <span>{formatDate(patient.dataIngresso)}</span>
                            </div>
                            <div className="info-item">
                                <label>Indirizzo:</label>
                                <span>{mockPatientDetails.indirizzo}</span>
                            </div>
                            <div className="info-item">
                                <label>Psicologo Assegnato:</label>
                                <span>{patient.nomePsicologo || 'Non assegnato'}</span>
                            </div>
                            <div className="info-item">
                                <label>Score:</label>
                                <span className="score-value">
                                    {patient.score !== null ? patient.score : 'N/A'}
                                </span>
                            </div>
                            <div className="info-item">
                                <label>Stato Account:</label>
                                <span style={{
                                    color: mockPatientDetails.statoAccount === 'Attivo' ? '#7FB77E' : '#E57373',
                                    fontWeight: 'bold'
                                }}>
                                    {mockPatientDetails.statoAccount}
                                </span>
                            </div>
                            <div className="info-item">
                                <label>Ultimo Accesso:</label>
                                <span>{formatDate(mockPatientDetails.ultimoAccesso)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Terms Acceptance Section */}
                    <div className="notes-section">
                        <h3 className="section-title">Termini e Condizioni</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Termini Accettati:</label>
                                <span style={{
                                    color: mockPatientDetails.termsAccettati ? '#7FB77E' : '#E57373',
                                    fontWeight: 'bold'
                                }}>
                                    {mockPatientDetails.termsAccettati ? 'SÌ' : 'NO'}
                                </span>
                            </div>
                            <div className="info-item">
                                <label>Data Accettazione:</label>
                                <span>{formatDate(mockPatientDetails.dataAccettazioneTerms)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Questionnaires Summary */}
                    <div className="notes-section">
                        <h3 className="section-title">Riepilogo Questionari</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Numero Questionari Compilati:</label>
                                <span className="score-value">{mockPatientDetails.numeroQuestionari}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes section - visible if notes exist */}
                    {mockPatientDetails.note && (
                        <div className="notes-section">
                            <h3 className="section-title">Note</h3>
                            <div className="notes-content">{mockPatientDetails.note}</div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {/* Footer vuoto - chiusura solo tramite X in alto */}
                </div>
            </div>
        </div>
    );
};

export default AdminPatientDetailModal;
