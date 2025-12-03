import React, { useState } from 'react';
import '../css/QuickNote.css';
import noteIcon from '../assets/icons/diary.svg';
import editIcon from '../assets/icons/edit-pen.svg';
import { getDiaryPages, createDiaryPage, updateDiaryPage } from '../services/diary.service';
import Toast from './Toast';

const QuickNote: React.FC = () => {
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleSave = async () => {
        if (!note.trim()) return;

        setLoading(true);
        try {
            // 1. Fetch all diary pages
            const pages = await getDiaryPages();

            // 2. Check if a page with today's date exists
            const today = new Date();
            const todayPage = pages.find(page => {
                const pageDate = new Date(page.createdAt);
                return (
                    pageDate.getDate() === today.getDate() &&
                    pageDate.getMonth() === today.getMonth() &&
                    pageDate.getFullYear() === today.getFullYear()
                );
            });

            if (todayPage) {
                // 3. If yes: Update existing page
                await updateDiaryPage(todayPage.id, {
                    title: todayPage.title,
                    content: `${todayPage.content}\n\n${note}`
                });
            } else {
                // 4. If no: Create new page
                await createDiaryPage({
                    title: `Diario del ${today.toLocaleDateString('it-IT')}`,
                    content: note
                });
            }

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
