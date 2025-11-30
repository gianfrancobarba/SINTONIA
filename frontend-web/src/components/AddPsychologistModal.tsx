import React, { useState, useRef, useEffect } from 'react';
import { X, UserPlus, Search } from 'lucide-react';
import '../css/AddPsychologistModal.css';

interface PsychologistFormData {
    codiceFiscale: string;
    nome: string;
    cognome: string;
    email: string;
    aslAppartenenza: string;
    stato: 'Attivo' | 'Disattivato';
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onAdd(formData);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="add-psychologist-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <UserPlus size={24} className="modal-icon" />
                        <h2>Aggiungi Nuovo Psicologo</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="psychologist-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nome">
                                Nome <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Inserisci il nome"
                                className={errors.nome ? 'error' : ''}
                            />
                            {errors.nome && (
                                <span className="error-message">{errors.nome}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="cognome">
                                Cognome <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="cognome"
                                name="cognome"
                                value={formData.cognome}
                                onChange={handleChange}
                                placeholder="Inserisci il cognome"
                                className={errors.cognome ? 'error' : ''}
                            />
                            {errors.cognome && (
                                <span className="error-message">{errors.cognome}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="codiceFiscale">
                                Codice Fiscale <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="codiceFiscale"
                                name="codiceFiscale"
                                value={formData.codiceFiscale}
                                onChange={handleChange}
                                maxLength={16}
                                placeholder="16 caratteri"
                                className={errors.codiceFiscale ? 'error' : ''}
                            />
                            {errors.codiceFiscale && (
                                <span className="error-message">{errors.codiceFiscale}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="aslAppartenenza">
                                ASL di Appartenenza <span className="required">*</span>
                            </label>
                            <div style={{ position: 'relative' }} ref={dropdownRef}>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        id="aslAppartenenza"
                                        name="aslAppartenenza"
                                        value={formData.aslAppartenenza || aslSearch}
                                        onChange={(e) => {
                                            setAslSearch(e.target.value);
                                            setFormData(prev => ({ ...prev, aslAppartenenza: '' })); // Clear selection when typing
                                            setShowAslDropdown(true);
                                        }}
                                        onFocus={() => setShowAslDropdown(true)}
                                        placeholder="Cerca ASL..."
                                        className={errors.aslAppartenenza ? 'error' : ''}
                                        autoComplete="off"
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
                                        borderRadius: '8px',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        zIndex: 1000,
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        {filteredAslOptions.length > 0 ? (
                                            filteredAslOptions.map(asl => (
                                                <div
                                                    key={asl}
                                                    onClick={() => handleAslSelect(asl)}
                                                    style={{
                                                        padding: '10px 16px',
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
                                <span className="error-message">{errors.aslAppartenenza}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="email">
                                Email <span className="required">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="esempio@email.it"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && (
                                <span className="error-message">{errors.email}</span>
                            )}
                        </div>
                    </div>



                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Annulla
                        </button>
                        <button type="submit" className="submit-btn">
                            <UserPlus size={18} />
                            Aggiungi Psicologo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPsychologistModal;
