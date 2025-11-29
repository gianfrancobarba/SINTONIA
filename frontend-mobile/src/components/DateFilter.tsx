import React from 'react';
import '../css/DateFilter.css';
import type { MonthYearOption } from '../services/diary.service';

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
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === 'all') {
            onFilterChange(undefined, undefined);
        } else {
            const [month, year] = value.split('-').map(Number);
            onFilterChange(month, year);
        }
    };

    const getCurrentValue = () => {
        if (selectedMonth === undefined && selectedYear === undefined) {
            return 'all';
        }
        return `${selectedMonth}-${selectedYear}`;
    };

    return (
        <div className="date-filter">
            <select
                className="date-filter-select"
                value={getCurrentValue()}
                onChange={handleChange}
            >
                {options.map((option, index) => {
                    const value = option.month === undefined && option.year === undefined
                        ? 'all'
                        : `${option.month}-${option.year}`;

                    return (
                        <option key={index} value={value}>
                            {option.label}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default DateFilter;
