import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftArrowIcon from '../assets/icons/LeftArrow.svg';
import ProgressIndicator from '../components/ProgressIndicator';
import MoodWheel from '../components/MoodWheel';
import IntensitySelector from '../components/IntensitySelector';
import Toast from '../components/Toast';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { createMood, getTodayMood, deleteMood, updateMood } from '../services/mood.service';
import type { Umore } from '../types/mood';
import '../css/MoodEntry.css';

const MoodEntry: React.FC = () => {
    const navigate = useNavigate();

    // State per i tre step
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedMood, setSelectedMood] = useState<Umore | null>('Felice');
    const [selectedIntensity, setSelectedIntensity] = useState<number | null>(null);
    const [notes, setNotes] = useState('');

    // State per UI
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [existingMoodId, setExistingMoodId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    React.useEffect(() => {
        const fetchMood = async () => {
            try {
                const mood = await getTodayMood();
                if (mood) {
                    setSelectedMood(mood.umore);
                    setSelectedIntensity(mood.intensita || null);
                    setNotes(mood.note || '');
                    setExistingMoodId(mood.id);
                } else {
                    // Default mood if none exists
                    setSelectedMood('Felice');
                }
            } catch (error) {
                console.error('Error fetching today mood:', error);
                // Default mood on error
                setSelectedMood('Felice');
            }
        };
        fetchMood();
    }, []);

    const handleDelete = async () => {
        setShowDeleteModal(false);
        try {
            if (existingMoodId) {
                await deleteMood(existingMoodId);
            }
            setToast({ message: 'Stato d\'animo eliminato', type: 'success' });
            setTimeout(() => navigate('/home'), 1500);
        } catch (error) {
            setToast({ message: 'Errore durante l\'eliminazione', type: 'error' });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    const handleContinue = async () => {
        // Validazione per ogni step
        if (currentStep === 1 && !selectedMood) {
            setToast({ message: 'Seleziona uno stato d\'animo per continuare', type: 'error' });
            return;
        }

        if (currentStep < 3) {
            // Vai al prossimo step
            setCurrentStep(currentStep + 1);
            setToast(null);
        } else {
            // Step 3: Submit finale
            if (!selectedMood) {
                setToast({ message: 'Errore: stato d\'animo non selezionato', type: 'error' });
                return;
            }

            setSubmitting(true);
            setToast(null);

            try {
                if (existingMoodId) {
                    await updateMood(
                        existingMoodId,
                        selectedMood,
                        selectedIntensity ?? undefined,
                        notes.trim() || undefined
                    );
                    setToast({ message: 'Stato d\'animo aggiornato con successo!', type: 'success' });
                } else {
                    await createMood(
                        selectedMood,
                        selectedIntensity ?? undefined,
                        notes.trim() || undefined
                    );
                    setToast({ message: 'Stato d\'animo registrato con successo!', type: 'success' });
                }
                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            } catch (err) {
                console.error('Error submitting mood:', err);
                const errorMessage = err instanceof Error ? err.message : 'Errore durante l\'invio';
                setToast({ message: errorMessage, type: 'error' });
                setSubmitting(false);
            }
        }
    };

    const canContinue = () => {
        if (currentStep === 1) return selectedMood !== null;
        // Step 2 e 3 sono opzionali, quindi si può sempre continuare
        return true;
    };

    const handleConfirmMood = () => {
        if (selectedMood) {
            handleContinue();
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="step-content mood-step">
                        <MoodWheel
                            value={selectedMood}
                            onChange={setSelectedMood}
                            onConfirm={handleConfirmMood}
                            onDelete={() => setShowDeleteModal(true)}
                            showDelete={!!existingMoodId}
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="step-content">
                        <h2 className="step-title">Inserisci l'intensità</h2>
                        <IntensitySelector value={selectedIntensity} onChange={setSelectedIntensity} />
                    </div>
                );

            case 3:
                return (
                    <div className="step-content">
                        <h2 className="step-title">Inserisci note</h2>
                        <div className="notes-container">
                            <textarea
                                className="notes-textarea"
                                placeholder="Ho trascorso una lunga giornata lavorativa che non mi ha portato a nulla."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                maxLength={500}
                                rows={6}
                            />
                            <div className="character-count">
                                <span>{notes.length}/500</span>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="mood-entry-page">
            <header className="mood-entry-header">
                <button className="back-button" onClick={handleBack} aria-label="Indietro">
                    <img src={LeftArrowIcon} alt="Back" />
                </button>
                <h1 className="page-title"></h1>
                <div className="header-actions">
                    <ProgressIndicator current={currentStep} total={3} />
                </div>
            </header>

            <div className="mood-entry-content">
                {renderStepContent()}

                {/* Removed static error message div */}

                {currentStep > 1 && (
                    <button
                        className="btn-continue"
                        onClick={handleContinue}
                        disabled={!canContinue() || submitting}
                    >
                        {submitting ? 'Invio...' : 'Continua'}
                    </button>
                )}
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
                title="Elimina stato d'animo"
                message="Sei sicuro di voler eliminare lo stato d'animo di oggi? Questa azione non può essere annullata."
            />
        </div>
    );
};

export default MoodEntry;
