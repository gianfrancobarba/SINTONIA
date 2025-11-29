import React, { useState, useEffect } from 'react';
import type { PatientData } from '../types/patient';
import type { QuestionnaireData } from '../types/psychologist';
import { getPatientDetailsByPsychologist } from '../services/patient.service';
import { fetchQuestionnairesByPatient } from '../services/questionnaire.service';
import QuestionnaireDetailModal from './QuestionnaireDetailModal';
import '../css/QuestionnaireDetailModal.css'; // Reuse existing styles

interface PsychologistPatientDetailModalProps {
    patient: PatientData | null;
    onClose: () => void;
}

const PsychologistPatientDetailModal: React.FC<PsychologistPatientDetailModalProps> = ({
    patient,
    onClose,
}) => {
    const [patientDetails, setPatientDetails] = useState<any>(null);
    const [questionnaires, setQuestionnaires] = useState<QuestionnaireData[]>([]);
    const [viewingQuestionnaire, setViewingQuestionnaire] = useState<QuestionnaireData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingQuestionnaires, setLoadingQuestionnaires] = useState(true);

    useEffect(() => {
        if (patient) {
            loadPatientDetails();
            loadQuestionnaires();
        }
    }, [patient]);

    const loadPatientDetails = async () => {
        if (!patient) return;

        setLoading(true);
        try {
            const details = await getPatientDetailsByPsychologist(patient.idPaziente);
            setPatientDetails(details);
        } catch (error) {
            console.error('Error loading patient details:', error);
            alert('Errore nel caricamento dei dettagli del paziente');
        } finally {
            setLoading(false);
        }
    };

    const loadQuestionnaires = async () => {
        if (!patient) return;

        setLoadingQuestionnaires(true);
        try {
            const data = await fetchQuestionnairesByPatient('psychologist', patient.idPaziente);
            setQuestionnaires(data);
        } catch (error) {
            console.error('Error loading questionnaires:', error);
        } finally {
            setLoadingQuestionnaires(false);
        }
    };

    const handleViewQuestionnaire = (questionnaire: QuestionnaireData) => {
        setViewingQuestionnaire(questionnaire);
    };

    const handleCloseQuestionnaireModal = () => {
        setViewingQuestionnaire(null);
    };

    if (!patient) return null;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return dateString;
    };

    return (
        <>
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
                                            <span>{patientDetails.email}</span>
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
                                            <span>{patientDetails.residenza}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Sesso:</label>
                                            <span>{patientDetails.sesso}</span>
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

                                {/* Questionnaires Section - with spacing */}
                                <div className="notes-section" style={{ marginTop: '24px' }}>
                                    <h3 className="section-title">Questionari Compilati</h3>
                                    {loadingQuestionnaires ? (
                                        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                            Caricamento questionari...
                                        </div>
                                    ) : questionnaires.length > 0 ? (
                                        <div style={{ marginTop: '12px' }}>
                                            <table style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                fontSize: '14px'
                                            }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '2px solid #ddd' }}>
                                                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Tipologia</th>
                                                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Data</th>
                                                        <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Score</th>
                                                        <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Revisionato</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {questionnaires.map((q) => (
                                                        <tr
                                                            key={q.idQuestionario}
                                                            onClick={() => handleViewQuestionnaire(q)}
                                                            style={{
                                                                borderBottom: '1px solid #eee',
                                                                cursor: 'pointer',
                                                                transition: 'background-color 0.2s ease'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        >
                                                            <td style={{ padding: '10px' }}>{q.nomeTipologia}</td>
                                                            <td style={{ padding: '10px' }}>{formatDate(q.dataCompilazione)}</td>
                                                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                                                <span style={{
                                                                    padding: '4px 8px',
                                                                    borderRadius: '4px',
                                                                    background: '#f0f0f0',
                                                                    fontWeight: 'bold'
                                                                }}>
                                                                    {q.score !== null ? q.score : 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                                                <span style={{
                                                                    color: q.revisionato ? '#7FB77E' : '#E57373',
                                                                    fontWeight: 'bold'
                                                                }}>
                                                                    {q.revisionato ? '✓ Sì' : '✗ No'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div style={{
                                                marginTop: '12px',
                                                padding: '8px',
                                                background: '#f8f9fa',
                                                borderRadius: '4px',
                                                fontSize: '13px',
                                                color: '#666'
                                            }}>
                                                Totale questionari: <strong>{questionnaires.length}</strong>
                                                <span style={{ marginLeft: '16px', color: '#999' }}>
                                                    💡 Clicca su un questionario per visualizzare le risposte
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '30px 20px',
                                            background: '#f8f9fa',
                                            borderRadius: '8px',
                                            marginTop: '12px'
                                        }}>
                                            <p style={{
                                                fontSize: '15px',
                                                color: '#666',
                                                margin: 0
                                            }}>
                                                📋 Nessun questionario compilato
                                            </p>
                                            <p style={{
                                                fontSize: '13px',
                                                color: '#999',
                                                marginTop: '8px',
                                                marginBottom: 0
                                            }}>
                                                Il paziente non ha ancora compilato questionari
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                Errore nel caricamento dei dettagli
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        {/* Footer vuoto - solo chiusura tramite X */}
                    </div>
                </div>
            </div>

            {/* Questionnaire Detail Modal */}
            {viewingQuestionnaire && (
                <QuestionnaireDetailModal
                    questionnaire={viewingQuestionnaire}
                    onClose={handleCloseQuestionnaireModal}
                    role="psychologist"
                />
            )}
        </>
    );
};

export default PsychologistPatientDetailModal;
