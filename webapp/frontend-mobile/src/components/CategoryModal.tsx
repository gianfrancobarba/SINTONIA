import React from 'react';
import type { ForumCategory } from '../types/forum';
import '../css/CategoryModal.css';

interface CategoryInfo {
    id: ForumCategory;
    label: string;
    color: string;
}

interface CategoryModalProps {
    categories: CategoryInfo[];
    selectedCategory: ForumCategory | null;
    onSelect: (category: ForumCategory) => void;
    onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    categories,
    selectedCategory,
    onSelect,
    onClose,
}) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Seleziona categoria</h3>
                <div className="category-list">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`category-option ${selectedCategory === cat.id ? 'selected' : ''}`}
                            style={{
                                borderColor: cat.color,
                                backgroundColor: selectedCategory === cat.id ? cat.color : 'transparent',
                                color: selectedCategory === cat.id ? 'white' : cat.color,
                            }}
                            onClick={() => onSelect(cat.id)}
                        >
                            <span className="category-name">{cat.label}</span>
                            {selectedCategory === cat.id && <span className="check-icon">✓</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;
