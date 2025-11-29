import React, { useState } from 'react';
import type { InvalidationRequestData } from '../types/invalidation';
import '../css/QuestionnaireDetailModal.css'; // Reuse existing styles

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
    if (!request) return null;

    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const isPending = request.stato === 'pending';

    const handleAccept = async () => {
        if (window.confirm('Sei sicuro di voler accettare questa richiesta di invalidazione?')) {
            setIsAccepting(true);
            try {
                await onAccept(request.idRichiesta);
                onClose();
            } catch (error) {
                console.error('Failed to accept invalidation request', error);
                alert('Errore durante l\'accettazione della richiesta');
            } finally {
                setIsAccepting(false);
            }
        }
    };

    const handleReject = async () => {
        if (window.confirm('Sei sicuro di voler rifiutare questa richiesta di invalidazione?')) {
            setIsRejecting(true);
            try {
                await onReject(request.idRichiesta);
                onClose();
            } catch (error) {
                console.error('Failed to reject invalidation request', error);
                alert('Errore durante il rifiuto della richiesta');
            } finally {
                setIsRejecting(false);
            }
        }
    };

    const getStatusInfo = (stato: string) => {
        switch (stato) {
            case 'pending':
                return { text: 'IN ATTESA', color: '#FFA726' };
            case 'approved':
                return { text: 'APPROVATA', color: '#7FB77E' };
            case 'rejected':
                return { text: 'RIFIUTATA', color: '#E57373' };
            default:
                return { text: stato.toUpperCase(), color: '#999' };
        }
    };

    const statusInfo = getStatusInfo(request.stato);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2 className="modal-title">Dettagli Richiesta Invalidazione</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Chiudi">
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <div className="questionnaire-info">
                        <div className="info-grid">
                            <div className="info-item">
                                <label>ID Questionario:</label>
                                <span>{request.idQuestionario}</span>
                            </div>
                            <div className="info-item">
                                <label>Tipologia Questionario:</label>
                                <span>{request.nomeQuestionario}</span>
                            </div>
                            <div className="info-item">
                                <label>Richiedente:</label>
                                <span>{request.nomePsicologoRichiedente}</span>
                            </div>
                            <div className="info-item">
                                <label>ID Psicologo:</label>
                                <span>{request.idPsicologoRichiedente}</span>
                            </div>
                            <div className="info-item">
                                <label>Stato Richiesta:</label>
                                <span style={{
                                    color: statusInfo.color,
                                    fontWeight: 'bold'
                                }}>
                                    {statusInfo.text}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Note section */}
                    {request.note && (
                        <div className="notes-section">
                            <h3 className="section-title">Note Richiesta</h3>
                            <div className="notes-content">{request.note}</div>
                        </div>
                    )}

                    {/* Action buttons - visible only if pending */}
                    {isPending && (
                        <div className="invalidation-request-section">
                            <h3 className="section-title">Gestione Richiesta</h3>
                            <p style={{ marginBottom: '20px', color: '#666' }}>
                                Questa richiesta è in attesa di approvazione. Puoi accettare o rifiutare la richiesta.
                            </p>
                            <div className="action-buttons-container">
                                <button
                                    className="btn-action btn-accept"
                                    onClick={handleAccept}
                                    disabled={isAccepting || isRejecting}
                                >
                                    <span className="btn-icon">✓</span>
                                    <span className="btn-text">{isAccepting ? 'Accettazione...' : 'Accetta'}</span>
                                </button>
                                <button
                                    className="btn-action btn-reject"
                                    onClick={handleReject}
                                    disabled={isAccepting || isRejecting}
                                >
                                    <span className="btn-icon">✕</span>
                                    <span className="btn-text">{isRejecting ? 'Rifiuto...' : 'Rifiuta'}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Message for already processed requests */}
                    {!isPending && (
                        <div className="invalidation-request-section">
                            <h3 className="section-title">Stato Richiesta</h3>
                            <p style={{ marginBottom: '16px', color: '#666' }}>
                                {request.stato === 'approved'
                                    ? 'Questa richiesta è stata approvata e il questionario è stato invalidato.'
                                    : 'Questa richiesta è stata rifiutata.'}
                            </p>
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

export default AdminInvalidationDetailModal;
