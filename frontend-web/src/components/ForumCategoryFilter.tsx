import React from 'react';
import type { ForumCategory } from '../types/forum';
import '../css/ForumCategoryFilter.css';

interface ForumCategoryFilterProps {
    selectedCategory: ForumCategory | null;
    onSelectCategory: (category: ForumCategory | null) => void;
    questionCounts?: Record<ForumCategory, number>;
}

const ForumCategoryFilter: React.FC<ForumCategoryFilterProps> = ({
    selectedCategory,
    onSelectCategory,
    questionCounts
}) => {
    const categories: (ForumCategory | null)[] = [
        null,
        'Ansia',
        'Stress',
        'Tristezza',
        'Vita di Coppia'
    ];

    const getCategoryLabel = (category: ForumCategory | null): string => {
        if (category === null) return 'Tutte';
        return category;
    };

    const getCategoryCount = (category: ForumCategory | null): number | undefined => {
        if (!questionCounts || category === null) return undefined;
        return questionCounts[category];
    };

    return (
        <div className="forum-category-filter">
            <label className="filter-label">Filtra per categoria</label>
            <div className="category-pills">
                {categories.map((category) => (
                    <button
                        key={category || 'all'}
                        className={`category-pill ${selectedCategory === category ? 'active' : ''} ${category ? `category-${category.toLowerCase().replace(/\s+/g, '-')}` : ''}`}
                        onClick={() => onSelectCategory(category)}
                    >
                        <span className="category-name">{getCategoryLabel(category)}</span>
                        {getCategoryCount(category) !== undefined && (
                            <span className="category-count">{getCategoryCount(category)}</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ForumCategoryFilter;
