import React, { useEffect, useRef, useCallback } from 'react';
import '../css/CompactPagination.css';

interface CompactPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CompactPagination: React.FC<CompactPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange
}) => {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const currentPageRef = useRef(currentPage);

    // Keep ref in sync with prop
    useEffect(() => {
        currentPageRef.current = currentPage;
    }, [currentPage]);

    const clearTimers = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => clearTimers();
    }, [clearTimers]);

    const handleMouseDown = (direction: 'prev' | 'next') => {
        // Execute once immediately
        if (direction === 'prev' && currentPage > 1) {
            onPageChange(currentPage - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }

        // Start rapid scrolling after 300ms hold
        timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                const curr = currentPageRef.current;
                if (direction === 'prev' && curr > 1) {
                    onPageChange(curr - 1);
                } else if (direction === 'next' && curr < totalPages) {
                    onPageChange(curr + 1);
                }
            }, 50); // 50ms interval for rapid scrolling
        }, 300);
    };

    const handleMouseUp = () => {
        clearTimers();
    };

    const handleMouseLeave = () => {
        clearTimers();
    };

    if (totalPages <= 1) return null;

    return (
        <div className="compact-pagination">
            <button
                className="compact-pagination-btn"
                onMouseDown={() => handleMouseDown('prev')}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={() => handleMouseDown('prev')}
                onTouchEnd={handleMouseUp}
                disabled={currentPage === 1}
                aria-label="Pagina precedente"
            >
                ‹
            </button>
            <span className="compact-pagination-current">
                {currentPage} / {totalPages}
            </span>
            <button
                className="compact-pagination-btn"
                onMouseDown={() => handleMouseDown('next')}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={() => handleMouseDown('next')}
                onTouchEnd={handleMouseUp}
                disabled={currentPage === totalPages}
                aria-label="Pagina successiva"
            >
                ›
            </button>
        </div>
    );
};

export default CompactPagination;

