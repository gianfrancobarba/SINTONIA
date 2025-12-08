import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Ticket, FileText, Check, Send } from 'lucide-react';
import type { TechnicalSupportTicket } from '../types/technicalSupport';
import Toast from './Toast';
import '../css/Modal.css';

interface TechnicalSupportDetailModalProps {
    ticket: TechnicalSupportTicket | null;
    onClose: () => void;
    onTicketUpdated?: () => void;
}


const TechnicalSupportDetailModal: React.FC<TechnicalSupportDetailModalProps> = ({ ticket, onClose, onTicketUpdated }) => {
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [showReplyConfirm, setShowReplyConfirm] = useState(false);
    const [responseText, setResponseText] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    if (!ticket) return null;

    const handleSendResponse = async () => {
        if (!responseText.trim()) return;

        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const token = user?.access_token;

            const response = await fetch('http://localhost:3000/admin/support-request/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ticketId: ticket.idTicket,
                    response: responseText
                })
            });

            if (response.ok) {
                setToast({ message: 'Risposta inviata con successo!', type: 'success' });
                setResponseText('');
                setShowReplyConfirm(false);
                if (onTicketUpdated) onTicketUpdated();
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setToast({ message: 'Errore durante l\'invio della risposta.', type: 'error' });
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            setToast({ message: 'Errore di connessione.', type: 'error' });
        }
    };

    const handleCloseTicket = async () => {
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const token = user?.access_token;

            const response = await fetch('http://localhost:3000/admin/support-request/close', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ticketId: ticket.idTicket
                })
            });

            if (response.ok) {
                setToast({ message: 'Ticket chiuso con successo!', type: 'success' });
                setShowCloseConfirm(false);
                if (onTicketUpdated) onTicketUpdated();
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setToast({ message: 'Errore durante la chiusura del ticket.', type: 'error' });
            }
        } catch (error) {
            console.error('Error closing ticket:', error);
            setToast({ message: 'Errore di connessione.', type: 'error' });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'aperto': 'Aperto',
            'in-lavorazione': 'In Lavorazione',
            'risolto': 'Risolto',
            'chiuso': 'Chiuso'
        };
        return labels[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'aperto': '#FFB74D',
            'in-lavorazione': '#42A5F5',
            'risolto': '#7FB77E',
            'chiuso': '#9E9E9E'
        };
        return colors[status] || '#9E9E9E';
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay-blur" onClick={onClose}>
            <div
                className="modal-card modal-card-lg"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '900px' }}
            >
                {/* Header with Gradient */}
                <div className="modal-header-gradient">
                    <div className="modal-header-content">
                        <div className="modal-header-text">
                            <h2 className="modal-header-title">
                                Dettagli Ticket di Supporto
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
                <div style={{
                    padding: '32px',
                    background: '#f8f9fa',
                    maxHeight: 'calc(90vh - 200px)',
                    overflowY: 'auto'
                }}>
                    {/* Compact Info Section */}
                    <div className="modal-data-section">
                        <div className="modal-data-section-title">
                            <div className="modal-data-section-title-icon">
                                <Ticket size={14} />
                            </div>
                            Informazioni Ticket
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot" style={{ background: getStatusColor(ticket.stato) }}></div>
                            <span className="modal-data-row-label">Stato</span>
                            <span className="modal-data-row-value" style={{ color: getStatusColor(ticket.stato), fontWeight: '600' }}>
                                {getStatusLabel(ticket.stato)}
                            </span>
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot modal-data-row-dot-teal"></div>
                            <span className="modal-data-row-label">ID Ticket</span>
                            <span className="modal-data-row-value">{ticket.idTicket}</span>
                        </div>

                        <div className="modal-data-row">
                            <div className="modal-data-row-dot modal-data-row-dot-orange"></div>
                            <span className="modal-data-row-label">Data Invio</span>
                            <span className="modal-data-row-value">{formatDate(ticket.dataInvio)}</span>
                        </div>

                        {ticket.idPaziente && (
                            <div className="modal-data-row">
                                <div className="modal-data-row-dot modal-data-row-dot-cyan"></div>
                                <span className="modal-data-row-label">ID Paziente</span>
                                <span className="modal-data-row-value">{ticket.idPaziente}</span>
                            </div>
                        )}

                        {ticket.idPsicologo && (
                            <div className="modal-data-row">
                                <div className="modal-data-row-dot modal-data-row-dot-green"></div>
                                <span className="modal-data-row-label">ID Psicologo</span>
                                <span className="modal-data-row-value">{ticket.idPsicologo}</span>
                            </div>
                        )}
                    </div>

                    {/* Object Section */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        marginBottom: '24px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #1a5f7a 0%, #0D475D 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <FileText size={20} />
                            </div>
                            <h3 style={{
                                margin: 0,
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#1a1a1a'
                            }}>Oggetto</h3>
                        </div>
                        <p style={{
                            margin: 0,
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1a1a1a',
                            lineHeight: '1.6'
                        }}>
                            {ticket.oggetto}
                        </p>
                    </div>

                    {/* Description Section */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
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
                                <FileText size={20} />
                            </div>
                            <h3 style={{
                                margin: 0,
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#1a1a1a'
                            }}>Descrizione Completa</h3>
                        </div>
                        <p style={{
                            margin: 0,
                            fontSize: '15px',
                            color: '#666',
                            lineHeight: '1.8',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {ticket.descrizione}
                        </p>
                    </div>

                    {/* Response Section */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        marginTop: '24px'
                    }}>
                        <h3 style={{
                            margin: '0 0 16px 0',
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#1a1a1a'
                        }}>Rispondi al Ticket</h3>
                        <div
                            style={{
                                border: '2px solid #e0e0e0',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                marginBottom: '4px',
                                transition: 'border-color 0.2s ease'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#83B9C1'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                        >
                            <textarea
                                placeholder="Scrivi una risposta..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                rows={4}
                                maxLength={2000}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    resize: 'none',
                                    minHeight: '180px',
                                    maxHeight: '290px',
                                    overflowY: 'auto',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{
                            textAlign: 'right',
                            fontSize: '12px',
                            color: responseText.length >= 2000 ? '#E57373' : '#999',
                            marginBottom: '12px'
                        }}>
                            {responseText.length}/2000 caratteri
                        </div>
                        <button
                            onClick={() => setShowReplyConfirm(true)}
                            disabled={!responseText.trim()}
                            style={{
                                width: '100%',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: 'none',
                                background: responseText.trim()
                                    ? 'linear-gradient(135deg, #83B9C1 0%, #5a9aa5 100%)'
                                    : '#e0e0e0',
                                color: 'white',
                                cursor: responseText.trim() ? 'pointer' : 'not-allowed',
                                fontSize: '15px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: responseText.trim() ? '0 4px 12px rgba(131, 185, 193, 0.3)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (responseText.trim()) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(131, 185, 193, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                if (responseText.trim()) {
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(131, 185, 193, 0.3)';
                                }
                            }}
                        >
                            <Send size={18} />
                            Invia Risposta
                        </button>
                    </div>
                </div>

                {/* Footer with Actions */}
                <div style={{
                    padding: '24px 32px',
                    background: 'white',
                    borderTop: '1px solid #e8e8e8',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={() => setShowCloseConfirm(true)}
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
                        <Check size={18} />
                        Chiudi Ticket
                    </button>
                </div>

                {/* Close Confirmation Dialog */}
                {showCloseConfirm && (
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
                            zIndex: 1001
                        }}
                        onClick={() => setShowCloseConfirm(false)}
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
                                color: '#111827'
                            }}>
                                Conferma chiusura ticket
                            </h3>
                            <p style={{
                                margin: '0 0 20px 0',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                color: '#6b7280'
                            }}>
                                Sei sicuro di voler chiudere questo ticket di supporto? L'azione non può essere annullata.
                            </p>
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    onClick={() => setShowCloseConfirm(false)}
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
                                    onClick={handleCloseTicket}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        background: '#7FB77E',
                                        border: 'none',
                                        color: 'white'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#5fa05d';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#7FB77E';
                                    }}
                                >
                                    Conferma Chiusura
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reply Confirmation Dialog */}
                {showReplyConfirm && (
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
                            zIndex: 1001
                        }}
                        onClick={() => setShowReplyConfirm(false)}
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
                                color: '#111827'
                            }}>
                                Conferma invio risposta
                            </h3>
                            <p style={{
                                margin: '0 0 20px 0',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                color: '#6b7280'
                            }}>
                                Sei sicuro di voler inviare questa risposta? Verrà inviata una email al richiedente.
                            </p>
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    onClick={() => setShowReplyConfirm(false)}
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
                                    onClick={handleSendResponse}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        background: '#83B9C1',
                                        border: 'none',
                                        color: 'white'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#5a9aa5';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#83B9C1';
                                    }}
                                >
                                    Conferma Invio
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast Notification */}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </div>,
        document.body
    );
};

export default TechnicalSupportDetailModal;
