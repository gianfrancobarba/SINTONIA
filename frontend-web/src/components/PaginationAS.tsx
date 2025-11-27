/* Generico per paginazione */

import React from 'react';
import '../css/PaginationAS.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationAS: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="pagination">
            <button
                className="pagination-btn"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                ‹
            </button>
            <span className="pagination-current">{currentPage}</span>
            <button
                className="pagination-btn"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                ›
            </button>
        </div>
    );
};

export default PaginationAS;
