import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, UserPlus, Search } from 'lucide-react';
import '../css/Modal.css';
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
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
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
        <div className="modal-overlay-blur" onClick={onClose}>
            <div
                className="modal-card modal-card-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Gradient */}
                <div className="modal-header-gradient">
                    <div className="modal-header-content">
                        <div className="modal-header-text">
                            <h2 className="modal-header-title">
                                Aggiungi Nuovo Psicologo
                            </h2>
                            <p className="modal-header-subtitle">
                                Inserisci i dati del nuovo professionista
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="modal-close-btn-rounded"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="modal-body-gray modal-body-scrollable">
                    <form onSubmit={handleSubmit}>
                        {/* Nome & Cognome Row */}
                        <div className="modal-form-grid">
                            <div className="modal-form-group">
                                <label htmlFor="nome" className="modal-form-label modal-form-label-required">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    placeholder="Inserisci il nome"
                                    className={`modal-form-input ${errors.nome ? 'modal-form-input-error' : ''}`}
                                />
                                {errors.nome && (
                                    <span className="modal-form-error-text">{errors.nome}</span>
                                )}
                            </div>

                            <div className="modal-form-group">
                                <label htmlFor="cognome" className="modal-form-label modal-form-label-required">
                                    Cognome
                                </label>
                                <input
                                    type="text"
                                    id="cognome"
                                    name="cognome"
                                    value={formData.cognome}
                                    onChange={handleChange}
                                    placeholder="Inserisci il cognome"
                                    className={`modal-form-input ${errors.cognome ? 'modal-form-input-error' : ''}`}
                                />
                                {errors.cognome && (
                                    <span className="modal-form-error-text">{errors.cognome}</span>
                                )}
                            </div>
                        </div>

                        {/* Codice Fiscale & ASL Row */}
                        <div className="modal-form-grid" style={{ position: 'relative', zIndex: 20 }}>
                            <div className="modal-form-group">
                                <label htmlFor="codiceFiscale" className="modal-form-label modal-form-label-required">
                                    Codice Fiscale
                                </label>
                                <input
                                    type="text"
                                    id="codiceFiscale"
                                    name="codiceFiscale"
                                    value={formData.codiceFiscale}
                                    onChange={handleChange}
                                    maxLength={16}
                                    placeholder="16 caratteri"
                                    className={`modal-form-input ${errors.codiceFiscale ? 'modal-form-input-error' : ''}`}
                                />
                                {errors.codiceFiscale && (
                                    <span className="modal-form-error-text">{errors.codiceFiscale}</span>
                                )}
                            </div>

                            <div className="modal-form-group">
                                <label htmlFor="aslAppartenenza" className="modal-form-label modal-form-label-required">
                                    ASL di Appartenenza
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
                                            className={`modal-form-input ${errors.aslAppartenenza ? 'modal-form-input-error' : ''}`}
                                            style={{ paddingRight: '40px' }}
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
                                        <div className="modal-dropdown" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                            {filteredAslOptions.length > 0 ? (
                                                filteredAslOptions.map(asl => (
                                                    <div
                                                        key={asl}
                                                        onClick={() => handleAslSelect(asl)}
                                                        className={`modal-dropdown-item ${formData.aslAppartenenza === asl ? 'modal-dropdown-item-selected' : ''}`}
                                                    >
                                                        {asl}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="modal-dropdown-empty">
                                                    Nessuna ASL trovata
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {errors.aslAppartenenza && (
                                    <span className="modal-form-error-text">{errors.aslAppartenenza}</span>
                                )}
                            </div>
                        </div>

                        {/* Email Row */}
                        <div className="modal-form-group" style={{ position: 'relative', zIndex: 10 }}>
                            <label htmlFor="email" className="modal-form-label modal-form-label-required">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="esempio@email.it"
                                className={`modal-form-input ${errors.email ? 'modal-form-input-error' : ''}`}
                            />
                            {errors.email && (
                                <span className="modal-form-error-text">{errors.email}</span>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="modal-footer-actions">
                    <button onClick={onClose} className="btn-modal-secondary">
                        Annulla
                    </button>
                    <button onClick={handleSubmit} className="btn-modal-primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                                Aggiunta in corso...
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                Aggiungi Psicologo
                            </>
                        )}
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

