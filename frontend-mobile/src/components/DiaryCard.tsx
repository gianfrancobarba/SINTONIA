import React from 'react';
import type { DiaryPage } from '../types/diary';
import { formatDiaryDate } from '../services/diary.service';
import '../css/DiaryCard.css';
import RightArrow from '../assets/icons/RightArrow.svg';
import EditIcon from '../assets/icons/edit-pen.svg';

interface DiaryCardProps {
    page: DiaryPage;
    position: 'center' | 'left' | 'right' | 'hidden';
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    zIndex: number;
}

const DiaryCard: React.FC<DiaryCardProps> = ({
    page,
    position,
    onSwipeLeft,
    onSwipeRight,
    onEdit,
    onDelete,
    zIndex
}) => {
    // Tronca il contenuto per l'anteprima
    const truncateContent = (text: string, maxLength: number = 280) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Colori alternati per le carte (basato sull'ID)
    const getCardColor = (id: string): string => {
        const colors = ['#7DD3C0', '#A8D5BA']; // Azzurro e verde pastello
        const index = parseInt(id, 10) % colors.length;
        return colors[index];
    };

    return (
        <div
            className={`diary-card diary-card-${position}`}
            style={{
                zIndex,
                backgroundColor: getCardColor(page.id)
            }}
        >
            <div className="diary-card-content">
                <div className="diary-card-header">
                    <div className="diary-card-title-section">
                        <h3 className="diary-card-title">{page.title}</h3>
                        <span className="diary-card-date">{formatDiaryDate(page.createdAt)}</span>
                    </div>

                    {position === 'center' && (
                        <div className="diary-card-actions">
                            {onEdit && (
                                <button
                                    className="diary-action-btn edit-btn"
                                    onClick={() => onEdit(page.id)}
                                    aria-label="Modifica"
                                >
                                    <img src={EditIcon} alt="" />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    className="diary-action-btn delete-btn"
                                    onClick={() => onDelete(page.id)}
                                    aria-label="Elimina"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="diary-card-text">
                    {truncateContent(page.content)}
                </div>

                {position === 'center' && (
                    <div className="diary-card-navigation">
                        <button
                            className="diary-nav-arrow diary-nav-left"
                            onClick={onSwipeRight}
                            disabled={!onSwipeRight}
                            aria-label="Pagina precedente"
                        >
                            <img src={RightArrow} alt="" className="arrow-left" />
                        </button>
                        <button
                            className="diary-nav-arrow diary-nav-right"
                            onClick={onSwipeLeft}
                            disabled={!onSwipeLeft}
                            aria-label="Pagina successiva"
                        >
                            <img src={RightArrow} alt="" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiaryCard;
