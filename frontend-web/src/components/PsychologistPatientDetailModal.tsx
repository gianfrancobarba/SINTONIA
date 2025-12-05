import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Hash, User, CreditCard, Mail, Calendar, Home, Users2, Award, AlertTriangle, FileText, Check, X, ClipboardList, Download } from 'lucide-react';
import type { PatientData } from '../types/patient';
import type { QuestionnaireData } from '../types/psychologist';
import { getPatientDetailsByPsychologist, terminatePatientCare, generateReport, getReport } from '../services/patient.service';
import { fetchQuestionnairesByPatient, reviewQuestionnaire, requestInvalidation, viewQuestionnaire } from '../services/questionnaire.service';
import QuestionnaireDetailModal from './QuestionnaireDetailModal';
import Toast from './Toast';
import { jsPDF } from 'jspdf';
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
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [viewingReport, setViewingReport] = useState<{ content: string; date: string } | null>(null);
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

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

    const handleGenerateReport = async () => {
        if (!patient) return;
        setIsGeneratingReport(true);
        try {
            await generateReport(patient.idPaziente);
            setToast({ message: 'Report generato con successo!', type: 'success' });
            loadPatientDetails(); // Reload to update hasReport status
        } catch (error) {
            console.error('Error generating report:', error);
            setToast({ message: 'Errore durante la generazione del report', type: 'error' });
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const handleViewReport = async () => {
        if (!patient) return;
        setIsLoadingReport(true);
        try {
            const report = await getReport(patient.idPaziente);
            setViewingReport({
                content: report.contenuto,
                date: report.dataReport
            });
        } catch (error) {
            console.error('Error fetching report:', error);
            setToast({ message: 'Nessun report trovato o errore nel caricamento', type: 'error' });
        } finally {
            setIsLoadingReport(false);
        }
    };

    const handleDownloadPdf = () => {
        if (!viewingReport || !patient) return;
        setIsDownloadingPdf(true);
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            const contentWidth = pageWidth - 2 * margin;
            let yPosition = margin;

            // Colors
            const primaryColor: [number, number, number] = [13, 71, 92]; // #0D475C
            const grayColor: [number, number, number] = [100, 100, 100];
            const lightGray: [number, number, number] = [200, 200, 200];

            // Patient info
            const patientName = `${patient.nome} ${patient.cognome}`;
            const reportDate = viewingReport.date
                ? new Date(viewingReport.date).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
                : 'Data non disponibile';

            // Header background
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, pageWidth, 40, 'F');

            // Header title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('REPORT CLINICO', pageWidth / 2, 18, { align: 'center' });

            // Subtitle
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text('Sintonia - Piattaforma di Supporto Psicologico', pageWidth / 2, 30, { align: 'center' });

            yPosition = 55;

            // Patient info box
            doc.setFillColor(245, 247, 250);
            doc.setDrawColor(...lightGray);
            doc.setLineWidth(0.3);
            doc.roundedRect(margin, yPosition - 5, contentWidth, 30, 3, 3, 'FD');

            doc.setTextColor(...primaryColor);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('Paziente:', margin + 5, yPosition + 5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(patientName, margin + 30, yPosition + 5);

            doc.setTextColor(...primaryColor);
            doc.setFont('helvetica', 'bold');
            doc.text('Data:', margin + 5, yPosition + 16);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(reportDate, margin + 22, yPosition + 16);

            yPosition += 38;

            // Report content
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');

            const contentLines = doc.splitTextToSize(viewingReport.content, contentWidth);
            const lineHeight = 5;

            for (const line of contentLines) {
                // Check if we need a new page (leave space for footer and legal)
                if (yPosition > pageHeight - 60) {
                    doc.addPage();
                    yPosition = margin;
                }

                // Check for section headers
                if (line.match(/^[A-Z\s]+:?$/) || line.includes('===') || line.includes('---')) {
                    if (line.includes('===') || line.includes('---')) {
                        doc.setDrawColor(...lightGray);
                        doc.line(margin, yPosition, pageWidth - margin, yPosition);
                        yPosition += lineHeight;
                        continue;
                    }
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(...primaryColor);
                    yPosition += 3;
                } else {
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(0, 0, 0);
                }

                doc.text(line, margin, yPosition);
                yPosition += lineHeight;
            }

            // === LEGAL DISCLAIMER ===
            // Check if we need a new page for disclaimer
            if (yPosition > pageHeight - 70) {
                doc.addPage();
                yPosition = margin;
            }

            yPosition += 10;

            // Legal box
            doc.setFillColor(255, 250, 245);
            doc.setDrawColor(180, 140, 100);
            doc.setLineWidth(0.3);
            doc.roundedRect(margin, yPosition, contentWidth, 40, 2, 2, 'FD');

            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(140, 90, 40);
            doc.text('DOCUMENTO RISERVATO', margin + 5, yPosition + 8);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 70, 40);
            const legalText = 'Questo documento contiene informazioni riservate e confidenziali relative al percorso terapeutico del paziente. ' +
                'È destinato esclusivamente al professionista sanitario autorizzato. ' +
                'Si prega di non divulgare, copiare o distribuire questo documento.';

            const legalLines = doc.splitTextToSize(legalText, contentWidth - 10);
            let legalY = yPosition + 16;
            for (const l of legalLines) {
                doc.text(l, margin + 5, legalY);
                legalY += 4;
            }

            // Footer on each page
            const totalPages = doc.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(...grayColor);

                // Footer line
                doc.setDrawColor(...lightGray);
                doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

                doc.text(
                    `Pagina ${i} di ${totalPages}`,
                    pageWidth / 2,
                    pageHeight - 8,
                    { align: 'center' }
                );
                doc.text(
                    'Documento generato da Sintonia',
                    margin,
                    pageHeight - 8
                );
                doc.text(
                    new Date().toLocaleDateString('it-IT'),
                    pageWidth - margin,
                    pageHeight - 8,
                    { align: 'right' }
                );
            }

            // Save the PDF
            doc.save(`report_clinico_${patient.cognome}_${new Date().toISOString().split('T')[0]}.pdf`);

            setToast({ message: 'PDF scaricato con successo!', type: 'success' });
        } catch (error) {
            console.error('Error generating PDF:', error);
            setToast({ message: 'Errore durante la generazione del PDF', type: 'error' });
        } finally {
            setIsDownloadingPdf(false);
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
                                        {viewingReport ? 'Report Clinico' : 'Dettagli Paziente'}
                                    </h2>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '14px',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontWeight: '500'
                                    }}>
                                        {viewingReport
                                            ? `Generato il ${new Date(viewingReport.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                                            : `${patient.nome} ${patient.cognome}`
                                        }
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    {!viewingReport ? (
                                        <>
                                            <button
                                                onClick={handleGenerateReport}
                                                disabled={isGeneratingReport}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.2)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    color: 'white',
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    cursor: isGeneratingReport ? 'not-allowed' : 'pointer',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isGeneratingReport) {
                                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isGeneratingReport) {
                                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                                    }
                                                }}
                                            >
                                                <FileText size={16} />
                                                {isGeneratingReport ? 'Generazione...' : 'Genera Report'}
                                            </button>
                                            {patientDetails?.hasReport && (
                                                <button
                                                    onClick={handleViewReport}
                                                    disabled={isLoadingReport}
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.2)',
                                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                                        color: 'white',
                                                        padding: '8px 16px',
                                                        borderRadius: '8px',
                                                        cursor: isLoadingReport ? 'not-allowed' : 'pointer',
                                                        fontSize: '13px',
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isLoadingReport) {
                                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!isLoadingReport) {
                                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                                        }
                                                    }}
                                                >
                                                    <FileText size={16} />
                                                    {isLoadingReport ? 'Caricamento...' : 'Visualizza Report'}
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setViewingReport(null)}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.2)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    color: 'white',
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                Indietro
                                            </button>
                                            <button
                                                onClick={handleDownloadPdf}
                                                disabled={isDownloadingPdf}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.2)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    color: 'white',
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    cursor: isDownloadingPdf ? 'not-allowed' : 'pointer',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isDownloadingPdf) {
                                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isDownloadingPdf) {
                                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                                    }
                                                }}
                                            >
                                                <Download size={16} />
                                                {isDownloadingPdf ? 'Download...' : 'Scarica PDF'}
                                            </button>
                                        </>
                                    )}
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
                    </div>

                    {/* Body with Modern Cards */}
                    <div style={{
                        padding: '32px',
                        background: '#f8f9fa',
                        maxHeight: 'calc(90vh - 200px)',
                        overflowY: 'auto'
                    }}>
                        {viewingReport ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {/* Report Header Card */}
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid #eef2f5'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        marginBottom: '16px'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, #0D475C 0%, #1a6a85 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <FileText size={20} color="white" />
                                        </div>
                                        <div>
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#0D475C'
                                            }}>Report Clinico</h3>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '13px',
                                                color: '#6b7280'
                                            }}>
                                                {viewingReport.date ? new Date(viewingReport.date).toLocaleDateString('it-IT', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) : 'Data non disponibile'}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        gap: '12px'
                                    }}>
                                        <div style={{
                                            flex: 1,
                                            padding: '12px 16px',
                                            background: '#f8fafc',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Paziente</span>
                                            <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                                                {patient?.nome} {patient?.cognome}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Report Content Card */}
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid #eef2f5'
                                }}>
                                    <h4 style={{
                                        margin: '0 0 16px 0',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#0D475C',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>Contenuto del Report</h4>
                                    <div style={{
                                        fontSize: '14px',
                                        lineHeight: '1.75',
                                        color: '#374151',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {viewingReport.content.split('\n').map((line, index) => {
                                            // Check if it's a section header (all caps or has delimiters)
                                            if (line.includes('===') || line.includes('---')) {
                                                return <hr key={index} style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '16px 0' }} />;
                                            }
                                            if (line.match(/^[A-Z\s]+:?$/) && line.trim().length > 0) {
                                                return (
                                                    <p key={index} style={{
                                                        fontWeight: '600',
                                                        color: '#0D475C',
                                                        marginTop: '20px',
                                                        marginBottom: '8px',
                                                        fontSize: '15px'
                                                    }}>{line}</p>
                                                );
                                            }
                                            if (line.trim() === '') {
                                                return <br key={index} />;
                                            }
                                            return <p key={index} style={{ margin: '0 0 8px 0' }}>{line}</p>;
                                        })}
                                    </div>
                                </div>

                                {/* Confidentiality Notice */}
                                <div style={{
                                    backgroundColor: '#fffbeb',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    border: '1px solid #fcd34d',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px'
                                }}>
                                    <AlertTriangle size={18} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                                    <div>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            color: '#92400e'
                                        }}>Documento Riservato</p>
                                        <p style={{
                                            margin: '4px 0 0',
                                            fontSize: '12px',
                                            color: '#a16207',
                                            lineHeight: '1.5'
                                        }}>
                                            Questo documento contiene informazioni riservate e confidenziali relative al percorso terapeutico del paziente.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : loading ? (
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
                        {!viewingReport && (
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


