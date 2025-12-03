import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Ticket, User, Calendar, FileText, AlertCircle, Check, Send } from 'lucide-react';
import type { TechnicalSupportTicket } from '../types/technicalSupport';
import Toast from './Toast';
import '../css/QuestionnaireDetailModal.css';

interface TechnicalSupportDetailModalProps {
    ticket: TechnicalSupportTicket | null;
    onClose: () => void;
    onTicketUpdated?: () => void;
}

// Info Card Component
const InfoCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    iconColor: string;
}> = ({ icon, label, value, iconColor }) => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '14px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e8e8e8',
            transition: 'all 0.3s ease'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}>
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
        <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(4px)' }}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '900px',
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
                                    Dettagli Ticket di Supporto
                                </h2>
                                <p style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontWeight: '500'
                                }}>
                                    ID: {ticket.idTicket}
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
                    {/* Status and Date Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '16px',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '14px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #e8e8e8'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '10px',
                                    background: `linear-gradient(135deg, ${getStatusColor(ticket.stato)} 0%, ${getStatusColor(ticket.stato)}dd 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <AlertCircle size={16} />
                                </div>
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    color: '#666',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Stato
                                </span>
                            </div>
                            <p style={{
                                margin: 0,
                                fontSize: '14px',
                                fontWeight: '600',
                                color: getStatusColor(ticket.stato)
                            }}>
                                {getStatusLabel(ticket.stato)}
                            </p>
                        </div>

                        <InfoCard
                            icon={<Calendar size={16} />}
                            label="Data Invio"
                            value={formatDate(ticket.dataInvio)}
                            iconColor="#FFB74D"
                        />

                        <InfoCard
                            icon={<Ticket size={16} />}
                            label="ID Ticket"
                            value={ticket.idTicket}
                            iconColor="#0D475D"
                        />
                    </div>

                    {/* IDs Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                        marginBottom: '24px'
                    }}>
                        <InfoCard
                            icon={<User size={16} />}
                            label="ID Paziente"
                            value={ticket.idPaziente}
                            iconColor="#83B9C1"
                        />

                        <InfoCard
                            icon={<User size={16} />}
                            label="ID Psicologo"
                            value={ticket.idPsicologo || 'Non assegnato'}
                            iconColor="#7FB77E"
                        />
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
                        <textarea
                            placeholder="Scrivi una risposta..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                minHeight: '100px',
                                maxHeight: '250px',
                                outline: 'none',
                                transition: 'border-color 0.2s ease',
                                marginBottom: '12px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#83B9C1'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
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
