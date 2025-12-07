import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, UserPlus, Search } from 'lucide-react';
import '../css/AddPsychologistModal.css';
import Toast from './Toast';

interface PsychologistFormData {
    codiceFiscale: string;
    nome: string;
    cognome: string;
    email: string;
    aslAppartenenza: string;
    stato: 'Attivo' | 'Inattivo';  // Changed from 'Disattivato' to 'Inattivo'
}

const ASL_OPTIONS = [
    'NA-1',
    'NA-2',
    'NA-3',
    'SA-1',
    'SA-2',
    'SA-3',
    'AV-1',
    'AV-2',
    'BN-1',
    'CE-1',
    'CE-2',
];

interface AddPsychologistModalProps {
    onClose: () => void;
    onAdd: (psychologist: PsychologistFormData) => void;
}

const AddPsychologistModal: React.FC<AddPsychologistModalProps> = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState<PsychologistFormData>({
        codiceFiscale: '',
        nome: '',
        cognome: '',
        email: '',
        aslAppartenenza: '',
        stato: 'Attivo'
    });

    const [errors, setErrors] = useState<Partial<Record<keyof PsychologistFormData, string>>>({});
    const [aslSearch, setAslSearch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [showAslDropdown, setShowAslDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowAslDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredAslOptions = ASL_OPTIONS.filter(asl =>
        asl.toLowerCase().includes(aslSearch.toLowerCase())
    );

    const handleAslSelect = (asl: string) => {
        setFormData(prev => ({ ...prev, aslAppartenenza: asl }));
        setAslSearch('');
        setShowAslDropdown(false);
        if (errors.aslAppartenenza) {
            setErrors(prev => ({ ...prev, aslAppartenenza: undefined }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name as keyof PsychologistFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof PsychologistFormData, string>> = {};

        if (!formData.codiceFiscale.trim()) {
            newErrors.codiceFiscale = 'Il codice fiscale è obbligatorio';
        } else if (formData.codiceFiscale.length !== 16) {
            newErrors.codiceFiscale = 'Il codice fiscale deve essere di 16 caratteri';
        }

        if (!formData.nome.trim()) {
            newErrors.nome = 'Il nome è obbligatorio';
        }

        if (!formData.cognome.trim()) {
            newErrors.cognome = 'Il cognome è obbligatorio';
        }

        if (!formData.aslAppartenenza.trim()) {
            newErrors.aslAppartenenza = 'L\'ASL di appartenenza è obbligatoria';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email è obbligatoria';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Inserisci un\'email valida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);
            try {
                await onAdd(formData);
                setToast({ message: 'Psicologo aggiunto con successo!', type: 'success' });
                setTimeout(() => {
                    onClose();
                }, 1000);
            } catch (error: any) {
                console.error('Error adding psychologist:', error);
                const errorMessage = error.message?.includes('localhost') || error.message?.includes('fetch')
                    ? 'Errore di connessione al server.'
                    : (error.message || 'Errore durante l\'aggiunta dello psicologo.');
                setToast({ message: errorMessage, type: 'error' });
                setIsSubmitting(false); // Re-enable button on error
            }
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(4px)' }}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '700px',
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
                                    Aggiungi Nuovo Psicologo
                                </h2>
                                <p style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontWeight: '500'
                                }}>
                                    Inserisci i dati del nuovo professionista
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
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body with Modern Styling */}
                <div style={{
                    padding: '32px',
                    background: '#f8f9fa',
                    maxHeight: 'calc(90vh - 200px)',
                    overflowY: 'auto'
                }}>
                    <form onSubmit={handleSubmit} className="psychologist-form">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                            marginBottom: '20px'
                        }}>
                            <div className="form-group">
                                <label htmlFor="nome" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                                    Nome <span style={{ color: '#E57373' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    placeholder="Inserisci il nome"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: errors.nome ? '2px solid #E57373' : '2px solid #e0e0e0',
                                        borderRadius: '10px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#0D475D'}
                                    onBlur={(e) => e.target.style.borderColor = errors.nome ? '#E57373' : '#e0e0e0'}
                                />
                                {errors.nome && (
                                    <span style={{ color: '#E57373', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.nome}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="cognome" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                                    Cognome <span style={{ color: '#E57373' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="cognome"
                                    name="cognome"
                                    value={formData.cognome}
                                    onChange={handleChange}
                                    placeholder="Inserisci il cognome"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: errors.cognome ? '2px solid #E57373' : '2px solid #e0e0e0',
                                        borderRadius: '10px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#0D475D'}
                                    onBlur={(e) => e.target.style.borderColor = errors.cognome ? '#E57373' : '#e0e0e0'}
                                />
                                {errors.cognome && (
                                    <span style={{ color: '#E57373', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.cognome}</span>
                                )}
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                            marginBottom: '20px',
                            position: 'relative',
                            zIndex: 20
                        }}>
                            <div className="form-group">
                                <label htmlFor="codiceFiscale" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                                    Codice Fiscale <span style={{ color: '#E57373' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="codiceFiscale"
                                    name="codiceFiscale"
                                    value={formData.codiceFiscale}
                                    onChange={handleChange}
                                    maxLength={16}
                                    placeholder="16 caratteri"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: errors.codiceFiscale ? '2px solid #E57373' : '2px solid #e0e0e0',
                                        borderRadius: '10px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#0D475D'}
                                    onBlur={(e) => e.target.style.borderColor = errors.codiceFiscale ? '#E57373' : '#e0e0e0'}
                                />
                                {errors.codiceFiscale && (
                                    <span style={{ color: '#E57373', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.codiceFiscale}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="aslAppartenenza" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                                    ASL di Appartenenza <span style={{ color: '#E57373' }}>*</span>
                                </label>
                                <div style={{ position: 'relative', zIndex: 100 }} ref={dropdownRef}>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            id="aslAppartenenza"
                                            name="aslAppartenenza"
                                            value={formData.aslAppartenenza || aslSearch}
                                            onChange={(e) => {
                                                setAslSearch(e.target.value);
                                                setFormData(prev => ({ ...prev, aslAppartenenza: '' }));
                                                setShowAslDropdown(true);
                                            }}
                                            onFocus={() => setShowAslDropdown(true)}
                                            placeholder="Cerca ASL..."
                                            autoComplete="off"
                                            style={{
                                                width: '100%',
                                                padding: '12px 40px 12px 16px',
                                                border: errors.aslAppartenenza ? '2px solid #E57373' : '2px solid #e0e0e0',
                                                borderRadius: '10px',
                                                fontSize: '15px',
                                                outline: 'none',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onFocusCapture={(e) => e.target.style.borderColor = '#0D475D'}
                                            onBlur={(e) => e.target.style.borderColor = errors.aslAppartenenza ? '#E57373' : '#e0e0e0'}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'none',
                                            color: '#999'
                                        }}>
                                            <Search size={18} />
                                        </div>
                                    </div>

                                    {showAslDropdown && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            marginTop: '4px',
                                            backgroundColor: 'white',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '12px',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            zIndex: 1000,
                                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                                        }}>
                                            {filteredAslOptions.length > 0 ? (
                                                filteredAslOptions.map(asl => (
                                                    <div
                                                        key={asl}
                                                        onClick={() => handleAslSelect(asl)}
                                                        style={{
                                                            padding: '12px 16px',
                                                            cursor: 'pointer',
                                                            fontSize: '14px',
                                                            backgroundColor: formData.aslAppartenenza === asl ? '#f0f9f0' : 'white',
                                                            color: formData.aslAppartenenza === asl ? '#7FB77E' : '#333',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (formData.aslAppartenenza !== asl) {
                                                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (formData.aslAppartenenza !== asl) {
                                                                e.currentTarget.style.backgroundColor = 'white';
                                                            }
                                                        }}
                                                    >
                                                        {asl}
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{
                                                    padding: '16px',
                                                    textAlign: 'center',
                                                    color: '#999',
                                                    fontSize: '13px'
                                                }}>
                                                    Nessuna ASL trovata
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {errors.aslAppartenenza && (
                                    <span style={{ color: '#E57373', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.aslAppartenenza}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px', position: 'relative', zIndex: 10 }}>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                                Email <span style={{ color: '#E57373' }}>*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="esempio@email.it"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: errors.email ? '2px solid #E57373' : '2px solid #e0e0e0',
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    outline: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#0D475D'}
                                onBlur={(e) => e.target.style.borderColor = errors.email ? '#E57373' : '#e0e0e0'}
                            />
                            {errors.email && (
                                <span style={{ color: '#E57373', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>
                            )}
                        </div>
                    </form>
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
                    <button
                        onClick={onClose}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '12px',
                            border: '2px solid #e0e0e0',
                            background: 'white',
                            color: '#666',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f8f9fa';
                            e.currentTarget.style.borderColor = '#d0d0d0';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = '#e0e0e0';
                        }}
                    >
                        Annulla
                    </button>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #0D475D 0%, #1a5f7a 100%)',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(13, 71, 93, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(13, 71, 93, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 71, 93, 0.3)';
                        }}
                    >
                        <UserPlus size={18} />
                        Aggiungi Psicologo
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
        </div>,
        document.body
    );
};

export default AddPsychologistModal;
