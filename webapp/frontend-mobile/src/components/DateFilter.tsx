import React, { useState } from 'react';
import '../css/DateFilter.css';
import type { MonthYearOption } from '../services/diary.service';
import LeftArrowIcon from '../assets/icons/LeftArrow.svg';
import RightArrowIcon from '../assets/icons/RightArrow.svg';

interface DateFilterProps {
    options: MonthYearOption[];
    selectedMonth?: number;
    selectedYear?: number;
    onFilterChange: (month?: number, year?: number) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
    options,
    selectedMonth,
    selectedYear,
    onFilterChange
}) => {
    const getCurrentIndex = () => {
        if (selectedMonth === undefined && selectedYear === undefined) {
            return 0;
        }
        return options.findIndex(
            opt => opt.month === selectedMonth && opt.year === selectedYear
        );
    };

    const [currentIndex, setCurrentIndex] = useState(getCurrentIndex());

    const handlePrev = () => {
        const newIndex = Math.max(0, currentIndex - 1);
        setCurrentIndex(newIndex);
        const selected = options[newIndex];
        onFilterChange(selected.month, selected.year);
    };

    const handleNext = () => {
        const newIndex = Math.min(options.length - 1, currentIndex + 1);
        setCurrentIndex(newIndex);
        const selected = options[newIndex];
        onFilterChange(selected.month, selected.year);
    };

    const currentOption = options[currentIndex] || options[0];

    return (
        <div className="month-selector">
            <div className="month-selector-header">
                <button
                    className="month-nav-arrow"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                >
                    <img src={LeftArrowIcon} alt="Mese precedente" />
                </button>
                <h2 className="month-label">{currentOption.label}</h2>
                <button
                    className="month-nav-arrow"
                    onClick={handleNext}
                    disabled={currentIndex === options.length - 1}
                >
                    <img src={RightArrowIcon} alt="Mese successivo" />
                </button>
            </div>
        </div>
    );
};

export default DateFilter;
