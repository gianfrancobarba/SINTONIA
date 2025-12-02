import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Hash, User, CreditCard, Mail, Calendar, Home, Users2, Award, AlertTriangle, FileText, Check, X, ClipboardList } from 'lucide-react';
import type { PatientData } from '../types/patient';
import type { QuestionnaireData } from '../types/psychologist';
import { getPatientDetailsByPsychologist, terminatePatientCare } from '../services/patient.service';
import { fetchQuestionnairesByPatient, reviewQuestionnaire, requestInvalidation, viewQuestionnaire } from '../services/questionnaire.service';
import QuestionnaireDetailModal from './QuestionnaireDetailModal';
import Toast from './Toast';
import '../css/QuestionnaireDetailModal.css'; // Reuse existing styles

interface PsychologistPatientDetailModalProps {
    patient: PatientData | null;
    onClose: () => void;
}

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
            }}
        >
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

const PsychologistPatientDetailModal: React.FC<PsychologistPatientDetailModalProps> = ({
    patient,
    onClose,
}) => {
    const [patientDetails, setPatientDetails] = useState<any>(null);
    const [questionnaires, setQuestionnaires] = useState<QuestionnaireData[]>([]);
    const [viewingQuestionnaire, setViewingQuestionnaire] = useState<QuestionnaireData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingQuestionnaires, setLoadingQuestionnaires] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isTerminating, setIsTerminating] = useState(false);

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
            setToast({ message: 'Errore nel caricamento dei dettagli del paziente', type: 'error' });
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

    const handleViewQuestionnaire = async (questionnaire: QuestionnaireData) => {
        try {
            // Fetch full details including questions and answers
            const fullDetails = await viewQuestionnaire(questionnaire.idQuestionario, 'psychologist');
            setViewingQuestionnaire(fullDetails);
        } catch (error) {
            console.error('Error fetching questionnaire details:', error);
            setToast({ message: 'Errore nel caricamento dei dettagli del questionario', type: 'error' });
        }
    };

    const handleCloseQuestionnaireModal = () => {
        setViewingQuestionnaire(null);
    };

    const handleRequestInvalidation = async (id: string, notes: string) => {
        try {
            await requestInvalidation(id, notes);
            setToast({ message: 'Richiesta di invalidazione inviata con successo', type: 'success' });
            loadQuestionnaires(); // Reload to update status
        } catch (error) {
            console.error('Error requesting invalidation:', error);
            setToast({ message: 'Errore durante la richiesta di invalidazione', type: 'error' });
        }
    };

    const handleReview = async (id: string) => {
        try {
            await reviewQuestionnaire(id);
            loadQuestionnaires(); // Reload to update status
        } catch (error) {
            console.error('Error reviewing questionnaire:', error);
            // Toast is handled inside QuestionnaireDetailModal for review
            throw error; // Propagate error so modal can show it
        }
    };

    if (!patient) return null;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return ReactDOM.createPortal(
        <>
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
                                        {patient.nome} {patient.cognome}
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
                                Caricamento dettagli...
                            </div>
                        ) : patientDetails ? (
                            <>
                                {/* Patient Info Cards Grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '16px',
                                    marginBottom: '24px'
                                }}>
                                    <InfoCard
                                        icon={<Hash size={16} />}
                                        label="ID Paziente"
                                        value={patientDetails.idPaziente.substring(0, 16) + '...'}
                                        iconColor="#0D475D"
                                        tooltip={patientDetails.idPaziente}
                                    />
                                    <InfoCard
                                        icon={<User size={16} />}
                                        label="Nome Completo"
                                        value={`${patientDetails.nome} ${patientDetails.cognome}`}
                                        iconColor="#83B9C1"
                                    />
                                    <InfoCard
                                        icon={<CreditCard size={16} />}
                                        label="Codice Fiscale"
                                        value={patientDetails.codFiscale}
                                        iconColor="#7FB77E"
                                    />
                                    <InfoCard
                                        icon={<Mail size={16} />}
                                        label="Email"
                                        value={patientDetails.email}
                                        iconColor="#5a9aa5"
                                    />
                                    <InfoCard
                                        icon={<Calendar size={16} />}
                                        label="Data di Nascita"
                                        value={formatDate(patientDetails.dataNascita)}
                                        iconColor="#FFB74D"
                                    />
                                    <InfoCard
                                        icon={<Calendar size={16} />}
                                        label="Data Ingresso"
                                        value={formatDate(patientDetails.dataIngresso)}
                                        iconColor="#9575CD"
                                    />
                                    <InfoCard
                                        icon={<Home size={16} />}
                                        label="Residenza"
                                        value={patientDetails.residenza}
                                        iconColor="#66BB6A"
                                    />
                                    <InfoCard
                                        icon={<Users2 size={16} />}
                                        label="Sesso"
                                        value={patientDetails.sesso}
                                        iconColor="#42A5F5"
                                    />
                                    <InfoCard
                                        icon={<Award size={16} />}
                                        label="Score"
                                        value={patientDetails.score !== null ? String(patientDetails.score) : 'N/A'}
                                        iconColor="#FFA726"
                                    />
                                    <InfoCard
                                        icon={<AlertTriangle size={16} />}
                                        label="Priorità"
                                        value={patientDetails.idPriorita || 'N/A'}
                                        iconColor="#EF5350"
                                    />
                                </div>

                                {/* Questionnaires Section */}
                                <div style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #0D475D 0%, #1a5f7a 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white'
                                        }}>
                                            <ClipboardList size={20} />
                                        </div>
                                        <h3 style={{
                                            margin: 0,
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            color: '#1a1a1a'
                                        }}>Questionari Compilati</h3>
                                    </div>
                                    {loadingQuestionnaires ? (
                                        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                            Caricamento questionari...
                                        </div>
                                    ) : questionnaires.length > 0 ? (
                                        <>
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{
                                                    width: '100%',
                                                    borderCollapse: 'collapse',
                                                    fontSize: '14px'
                                                }}>
                                                    <thead>
                                                        <tr style={{
                                                            borderBottom: '2px solid #e0e0e0',
                                                            background: '#f8f9fa'
                                                        }}>
                                                            <th style={{
                                                                padding: '12px',
                                                                textAlign: 'left',
                                                                fontWeight: '700',
                                                                color: '#1a1a1a',
                                                                fontSize: '12px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}>Tipologia</th>
                                                            <th style={{
                                                                padding: '12px',
                                                                textAlign: 'left',
                                                                fontWeight: '700',
                                                                color: '#1a1a1a',
                                                                fontSize: '12px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}>Data</th>
                                                            <th style={{
                                                                padding: '12px',
                                                                textAlign: 'center',
                                                                fontWeight: '700',
                                                                color: '#1a1a1a',
                                                                fontSize: '12px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}>Score</th>
                                                            <th style={{
                                                                padding: '12px',
                                                                textAlign: 'center',
                                                                fontWeight: '700',
                                                                color: '#1a1a1a',
                                                                fontSize: '12px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}>Revisionato</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {questionnaires.map((q) => (
                                                            <tr
                                                                key={q.idQuestionario}
                                                                onClick={() => handleViewQuestionnaire(q)}
                                                                style={{
                                                                    borderBottom: '1px solid #f0f0f0',
                                                                    cursor: 'pointer',
                                                                    transition: 'background-color 0.2s ease'
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                            >
                                                                <td style={{
                                                                    padding: '12px',
                                                                    fontWeight: '500',
                                                                    color: '#1a1a1a'
                                                                }}>{q.nomeTipologia}</td>
                                                                <td style={{
                                                                    padding: '12px',
                                                                    color: '#666'
                                                                }}>{formatDate(q.dataCompilazione)}</td>
                                                                <td style={{
                                                                    padding: '12px',
                                                                    textAlign: 'center'
                                                                }}>
                                                                    <span style={{
                                                                        padding: '4px 12px',
                                                                        borderRadius: '8px',
                                                                        background: '#f0f0f0',
                                                                        fontWeight: '600',
                                                                        fontSize: '13px',
                                                                        color: '#1a1a1a'
                                                                    }}>
                                                                        {q.score !== null ? q.score : 'N/A'}
                                                                    </span>
                                                                </td>
                                                                <td style={{
                                                                    padding: '12px',
                                                                    textAlign: 'center'
                                                                }}>
                                                                    <span style={{
                                                                        color: q.revisionato ? '#7FB77E' : '#E57373',
                                                                        fontWeight: '600',
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '4px',
                                                                        fontSize: '13px'
                                                                    }}>
                                                                        {q.revisionato ? <><Check size={14} /> Sì</> : <><X size={14} /> No</>}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div style={{
                                                marginTop: '16px',
                                                padding: '12px 16px',
                                                background: '#f8f9fa',
                                                borderRadius: '12px',
                                                fontSize: '13px',
                                                color: '#666',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div>
                                                    Totale questionari: <strong style={{ color: '#1a1a1a' }}>{questionnaires.length}</strong>
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#999' }}>
                                                    💡 Clicca su un questionario per visualizzare le risposte
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '40px 20px',
                                            background: '#f8f9fa',
                                            borderRadius: '12px'
                                        }}>
                                            <FileText size={48} style={{ color: '#e0e0e0', margin: '0 auto 16px' }} />
                                            <p style={{
                                                fontSize: '15px',
                                                color: '#666',
                                                margin: '0 0 8px 0',
                                                fontWeight: '600'
                                            }}>
                                                Nessun questionario compilato
                                            </p>
                                            <p style={{
                                                fontSize: '13px',
                                                color: '#999',
                                                margin: 0
                                            }}>
                                                Il paziente non ha ancora compilato questionari
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#E57373' }}>
                                Errore nel caricamento dei dettagli
                            </div>
                        )}
                    </div>

                    {/* Footer vuoto - solo chiusura tramite X */}
                    <div className="modal-footer">
                        <button
                            className="terminate-cure-btn"
                            onClick={() => setShowConfirmModal(true)}
                            style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                        >
                            Termina cura
                        </button>
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

            {/* Questionnaire Detail Modal */}
            {viewingQuestionnaire && (
                <QuestionnaireDetailModal
                    questionnaire={viewingQuestionnaire}
                    onClose={handleCloseQuestionnaireModal}
                    role="psychologist"
                    onRequestInvalidation={handleRequestInvalidation}
                    onReview={handleReview}
                />
            )}


            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Custom Confirmation Modal */}
            {showConfirmModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000
                }} onClick={() => setShowConfirmModal(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        textAlign: 'center'
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#333' }}>Conferma Terminazione</h3>
                        <p style={{ color: '#666', marginBottom: '24px' }}>
                            Sei sicuro di voler terminare la cura di questo paziente?
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    background: 'white',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                Annulla
                            </button>
                            <button
                                onClick={async () => {
                                    setIsTerminating(true);
                                    try {
                                        await terminatePatientCare(patient.idPaziente);
                                        setToast({
                                            message: 'Terminazione cura avvenuta con successo',
                                            type: 'success'
                                        });
                                        setShowConfirmModal(false);
                                        // Delay closing to show the toast
                                        setTimeout(() => {
                                            onClose();
                                            // Reload page to refresh patient list
                                            window.location.reload();
                                        }, 1500);
                                    } catch (error: any) {
                                        setToast({
                                            message: error.response?.data?.message || 'Errore durante la terminazione della cura',
                                            type: 'error'
                                        });
                                        setShowConfirmModal(false);
                                    } finally {
                                        setIsTerminating(false);
                                    }
                                }}
                                disabled={isTerminating}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: isTerminating ? '#999' : '#dc3545',
                                    color: 'white',
                                    cursor: isTerminating ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                {isTerminating ? 'Terminazione...' : 'Termina'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>,
        document.body
    );
};

export default PsychologistPatientDetailModal;


