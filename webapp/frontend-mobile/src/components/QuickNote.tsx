import React, { useState } from 'react';
import '../css/QuickNote.css';
import noteIcon from '../assets/icons/diary.svg';
import editIcon from '../assets/icons/edit-pen.svg';
import { createDiaryPage } from '../services/diary.service';
import Toast from './Toast';

const QuickNote: React.FC = () => {
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleSave = async () => {
        if (!note.trim()) return;

        setLoading(true);
        try {
            // Create a new diary page with timestamp for uniqueness
            const now = new Date();
            const timeString = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

            await createDiaryPage({
                title: `Nota rapida - ${now.toLocaleDateString('it-IT')} ${timeString}`,
                content: note
            });

            // Clear input on success
            setNote('');
            setToast({ message: 'Nota salvata nel diario!', type: 'success' });
        } catch (error) {
            console.error('Error saving quick note:', error);
            setToast({ message: 'Errore nel salvataggio della nota.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quick-note-container">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="quick-note-card">
                <div className="note-icon">
                    <img src={noteIcon} alt="Note" />
                </div>
                <input
                    type="text"
                    placeholder="Vuoi inserire una nota rapida?"
                    className="note-input"
                    value={note}
                    maxLength={100}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={loading}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSave();
                        }
                    }}
                />
                <button
                    className="edit-button"
                    onClick={handleSave}
                    disabled={loading || !note.trim()}
                >
                    <img src={editIcon} alt="Edit" />
                </button>
            </div>
        </div>
    );
};

export default QuickNote;
