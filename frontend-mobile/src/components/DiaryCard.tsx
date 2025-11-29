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
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Tronca il contenuto per l'anteprima
    const truncateContent = (text: string, maxLength: number = 280) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Colori solidi e opachi per le carte - molti colori per evitare trasparenze
    const getCardColor = (id: string): string => {
        const colors = [
            '#B8E6D5', // Verde menta
            '#D4A5C7', // Rosa lavanda
            '#FFD6A5', // Pesca
            '#A8C5E6', // Azzurro chiaro
            '#F4C2C2', // Rosa corallo
            '#BFACE2', // Viola pastello
            '#FFE5B4', // Giallo crema
            '#C9E4CA', // Verde salvia
            '#F5CBA7', // Arancio chiaro  
            '#AED9E0'  // Turchese
        ];

        // Funzione di hash semplice per stringhe
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }

        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    const handleCardClick = () => {
        if (position === 'center' && !isExpanded) {
            setIsExpanded(true);
        }
    };

    const handleCloseExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(false);
    };

    return (
        <>
            {isExpanded && <div className="diary-card-overlay" onClick={handleCloseExpand} />}
            <div
                className={`diary-card diary-card-${position} ${isExpanded ? 'diary-card-expanded' : ''}`}
                style={{
                    zIndex: isExpanded ? 1000 : zIndex,
                    backgroundColor: getCardColor(page.id)
                }}
                onClick={handleCardClick}
            >
                <div className="diary-card-content">
                    <div className="diary-card-header">
                        <div className="diary-card-title-section">
                            <h3 className="diary-card-title">{page.title}</h3>
                            <span className="diary-card-date">{formatDiaryDate(page.createdAt)}</span>
                        </div>

                        {position === 'center' && (
                            <div className="diary-card-actions">
                                {isExpanded && (
                                    <button
                                        className="diary-action-btn close-expand-btn"
                                        onClick={handleCloseExpand}
                                        aria-label="Chiudi"
                                    >
                                        ×
                                    </button>
                                )}
                                {!isExpanded && onEdit && (
                                    <button
                                        className="diary-action-btn edit-btn"
                                        onClick={(e) => { e.stopPropagation(); onEdit(page.id); }}
                                        aria-label="Modifica"
                                    >
                                        <img src={EditIcon} alt="" />
                                    </button>
                                )}
                                {!isExpanded && onDelete && (
                                    <button
                                        className="diary-action-btn delete-btn"
                                        onClick={(e) => { e.stopPropagation(); onDelete(page.id); }}
                                        aria-label="Elimina"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="diary-card-text">
                        {isExpanded ? page.content : truncateContent(page.content)}
                    </div>

                    {position === 'center' && !isExpanded && (
                        <div className="diary-card-navigation">
                            <button
                                className="diary-nav-arrow diary-nav-left"
                                onClick={(e) => { e.stopPropagation(); onSwipeRight?.(); }}
                                disabled={!onSwipeRight}
                                aria-label="Pagina precedente"
                            >
                                <img src={RightArrow} alt="" />
                            </button>
                            <button
                                className="diary-nav-arrow diary-nav-right"
                                onClick={(e) => { e.stopPropagation(); onSwipeLeft?.(); }}
                                disabled={!onSwipeLeft}
                                aria-label="Pagina successiva"
                            >
                                <img src={RightArrow} alt="" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DiaryCard;
