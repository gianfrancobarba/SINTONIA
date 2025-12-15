import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FileText, Clock, AlertCircle, CheckCircle, XCircle, MessageSquare, Check, X } from 'lucide-react';
import type { InvalidationRequestData } from '../types/invalidation';
import Toast from './Toast';
import '../css/Modal.css';

interface AdminInvalidationDetailModalProps {
    request: InvalidationRequestData | null;
    onClose: () => void;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
}

const AdminInvalidationDetailModal: React.FC<AdminInvalidationDetailModalProps> = ({
    request,
    onClose,
    onAccept,
    onReject,
}) => {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    if (!request) return null;

    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);

    const isPending = request.stato === 'pending';

    const handleAccept = async () => {
        setIsAccepting(true);
        try {
            await onAccept(request.idRichiesta);
            setToast({ message: 'Richiesta accettata con successo', type: 'success' });
            setTimeout(() => onClose(), 1000);
        } catch (error) {
            console.error('Failed to accept invalidation request', error);
            setToast({ message: 'Errore durante l\'accettazione della richiesta', type: 'error' });
        } finally {
            setIsAccepting(false);
        }
    };

    const handleReject = async () => {
        setIsRejecting(true);
        try {
            await onReject(request.idRichiesta);
            setToast({ message: 'Richiesta rifiutata con successo', type: 'success' });
            setTimeout(() => onClose(), 1000);
        } catch (error) {
            console.error('Failed to reject invalidation request', error);
            setToast({ message: 'Errore durante il rifiuto della richiesta', type: 'error' });
        } finally {
            setIsRejecting(false);
        }
    };

    const getStatusInfo = (stato: string) => {
        switch (stato) {
            case 'pending':
                return { text: 'IN ATTESA', color: '#FFA726', icon: <Clock size={16} /> };
            case 'approved':
                return { text: 'APPROVATA', color: '#7FB77E', icon: <CheckCircle size={16} /> };
            case 'rejected':
                return { text: 'RIFIUTATA', color: '#E57373', icon: <XCircle size={16} /> };
            default:
                return { text: stato.toUpperCase(), color: '#999', icon: <AlertCircle size={16} /> };
        }
    };

    const statusInfo = getStatusInfo(request.stato);

    return ReactDOM.createPortal(
        <div className="modal-overlay-blur" onClick={onClose}>
            <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '1100px' }}
            >
                {/* Modern Header with Gradient */}
                <div className="modal-header-gradient">
                    <div className="modal-header-content">
                        <div className="modal-header-text">
                            <h2 className="modal-header-title">
                                Dettagli Richiesta Invalidazione
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="modal-close-btn-rounded"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body with Modern Cards */}
                <div className="modal-body-gray modal-body-scrollable">
                    {/* Compact Info Section */}
                    <div className="modal-data-section">
                        <div className="modal-data-section-title">
                            <div className="modal-data-section-title-icon">
                                <FileText size={14} />
                            </div>
                            Informazioni Richiesta
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot modal-data-row-dot-teal"></div>
                            <span className="modal-data-row-label">ID Questionario</span>
                            <span className="modal-data-row-value">{request.idQuestionario}</span>
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot modal-data-row-dot-cyan"></div>
                            <span className="modal-data-row-label">Tipologia</span>
                            <span className="modal-data-row-value modal-data-row-value-highlight">{request.nomeQuestionario}</span>
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot modal-data-row-dot-cyan"></div>
                            <span className="modal-data-row-label">Richiedente</span>
                            <span className="modal-data-row-value">{request.nomePsicologoRichiedente}</span>
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot modal-data-row-dot-green"></div>
                            <span className="modal-data-row-label">ID Psicologo</span>
                            <span className="modal-data-row-value">{request.idPsicologoRichiedente}</span>
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot" style={{ background: statusInfo.color }}></div>
                            <span className="modal-data-row-label">Stato Richiesta</span>
                            <span className="modal-data-row-value" style={{ color: statusInfo.color, fontWeight: '600' }}>{statusInfo.text}</span>
                        </div>
                    </div>

                    {/* Note section */}
                    {request.note && (
                        <div className="modal-info-card" style={{ marginTop: '24px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #83B9C1 0%, #5a9aa5 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <MessageSquare size={20} />
                                </div>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: '#1a1a1a'
                                }}>Note Richiesta</h3>
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: '#666',
                                lineHeight: '1.6',
                                background: '#f8f9fa',
                                padding: '16px',
                                borderRadius: '12px',
                                borderLeft: '3px solid #83B9C1',
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere'
                            }}>
                                {request.note}
                            </div>
                        </div>
                    )}

                    {/* Action section for pending requests */}
                    {isPending && (
                        <div className="modal-info-card">
                            <h3 style={{
                                margin: '0 0 16px 0',
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#1a1a1a'
                            }}>Gestione Richiesta</h3>
                            <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
                                Questa richiesta è in attesa di approvazione. Puoi accettare o rifiutare la richiesta.
                            </p>
                            <div className="modal-footer-actions">
                                <button
                                    onClick={() => setShowAcceptConfirm(true)}
                                    disabled={isAccepting || isRejecting}
                                    className="btn-modal-success"
                                    style={{
                                        flex: 1,
                                        opacity: (isAccepting || isRejecting) ? 0.6 : 1,
                                        cursor: (isAccepting || isRejecting) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <Check size={18} />
                                    {isAccepting ? 'Accettazione...' : 'Accetta'}
                                </button>
                                <button
                                    onClick={() => setShowRejectConfirm(true)}
                                    disabled={isAccepting || isRejecting}
                                    className="btn-modal-danger"
                                    style={{
                                        flex: 1,
                                        opacity: (isAccepting || isRejecting) ? 0.6 : 1,
                                        cursor: (isAccepting || isRejecting) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <X size={18} />
                                    {isRejecting ? 'Rifiuto...' : 'Rifiuta'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Message for already processed requests */}
                    {!isPending && (
                        <div className="modal-info-card">
                            <h3 style={{
                                margin: '0 0 16px 0',
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#1a1a1a'
                            }}>Stato Richiesta</h3>
                            <p style={{ marginBottom: '0', color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                                {request.stato === 'approved'
                                    ? 'Questa richiesta è stata approvata e il questionario è stato invalidato.'
                                    : 'Questa richiesta è stata rifiutata.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Modern Footer */}
                <div style={{
                    padding: '24px 32px',
                    background: 'white',
                    borderTop: '1px solid #e8e8e8'
                }}>
                    {/* Footer vuoto - chiusura solo tramite X in alto */}
                </div>
            </div>
            {/* Accept Confirmation Dialog */}
            {showAcceptConfirm && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10001
                    }}
                    onClick={() => setShowAcceptConfirm(false)}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '24px',
                            maxWidth: '400px',
                            width: '90%',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{
                            margin: '0 0 12px 0',
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            Conferma Accettazione
                        </h3>
                        <p style={{
                            margin: '0 0 20px 0',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#666'
                        }}>
                            Sei sicuro di voler accettare questa richiesta di invalidazione? Il questionario verrà invalidato.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={() => setShowAcceptConfirm(false)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: '#f3f4f6',
                                    border: '1px solid #e5e7eb',
                                    color: '#374151'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#e5e7eb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#f3f4f6';
                                }}
                            >
                                Annulla
                            </button>
                            <button
                                onClick={() => {
                                    setShowAcceptConfirm(false);
                                    handleAccept();
                                }}
                                disabled={isAccepting}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: isAccepting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: 'linear-gradient(135deg, #7FB77E 0%, #5fa05d 100%)',
                                    border: 'none',
                                    color: 'white'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isAccepting) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #5fa05d 0%, #4a8a4a 100%)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #7FB77E 0%, #5fa05d 100%)';
                                }}
                            >
                                {isAccepting ? 'Attendi...' : 'Conferma'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Confirmation Dialog */}
            {showRejectConfirm && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10001
                    }}
                    onClick={() => setShowRejectConfirm(false)}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '24px',
                            maxWidth: '400px',
                            width: '90%',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{
                            margin: '0 0 12px 0',
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            Conferma Rifiuto
                        </h3>
                        <p style={{
                            margin: '0 0 20px 0',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#666'
                        }}>
                            Sei sicuro di voler rifiutare questa richiesta di invalidazione? Il questionario rimarrà valido.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={() => setShowRejectConfirm(false)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: '#f3f4f6',
                                    border: '1px solid #e5e7eb',
                                    color: '#374151'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#e5e7eb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#f3f4f6';
                                }}
                            >
                                Annulla
                            </button>
                            <button
                                onClick={() => {
                                    setShowRejectConfirm(false);
                                    handleReject();
                                }}
                                disabled={isRejecting}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: isRejecting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                                    border: 'none',
                                    color: 'white'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isRejecting) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #B71C1C 0%, #8B0000 100%)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)';
                                }}
                            >
                                {isRejecting ? 'Attendi...' : 'Conferma'}
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
        </div>,
        document.body
    );
};



export default AdminInvalidationDetailModal;
