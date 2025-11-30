import React from 'react';
import type { ForumCategory } from '../types/forum';
import { categoryInfo } from '../services/forum.service';
import '../css/CategoryFilters.css';

interface CategoryFiltersProps {
    selectedCategories: ForumCategory[];
    onCategoryChange: (categories: ForumCategory[]) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ selectedCategories, onCategoryChange }) => {
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
