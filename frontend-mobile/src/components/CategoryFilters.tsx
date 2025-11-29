import React, { useState } from 'react';
import type { ForumCategory } from '../types/forum';
import { categoryInfo } from '../services/forum.service';
import '../css/CategoryFilters.css';

interface CategoryFiltersProps {
    selectedCategories: ForumCategory[];
    onCategoryChange: (categories: ForumCategory[]) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ selectedCategories, onCategoryChange }) => {
    const [showFilterOptions, setShowFilterOptions] = useState(false);

    const toggleCategory = (categoryId: ForumCategory) => {
        if (selectedCategories.includes(categoryId)) {
            onCategoryChange(selectedCategories.filter(c => c !== categoryId));
        } else {
            onCategoryChange([...selectedCategories, categoryId]);
        }
    };

    return (
        <div className="category-filters-container">
            <div className="category-filters-header">
                <h2 className="filters-title">Filtra per categoria</h2>
                <button
                    className="filter-icon-button"
                    onClick={() => setShowFilterOptions(!showFilterOptions)}
                    aria-label="Opzioni filtro"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4h16M5 10h10M8 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <div className="category-chips-scroll no-scrollbar">
                <div className="category-chips">
                    {categoryInfo.map((category) => {
                        const isSelected = selectedCategories.includes(category.id);
                        return (
                            <button
                                key={category.id}
                                className={`category-chip ${isSelected ? 'selected' : ''}`}
                                style={{
                                    backgroundColor: isSelected ? category.color : 'transparent',
                                    borderColor: category.color,
                                    color: isSelected ? 'white' : category.color,
                                }}
                                onClick={() => toggleCategory(category.id)}
                            >
                                {category.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CategoryFilters;
