import React, { useState, useEffect } from 'react';
import type { CalendarDay } from '../types/home';

interface CalendarProps {
    days: CalendarDay[]; // Initial data from backend
}

const Calendar: React.FC<CalendarProps> = ({ days: initialDays }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [displayDays, setDisplayDays] = useState<CalendarDay[]>([]);

    // Mappa data (YYYY-MM-DD) -> mood, costruita dai giorni con stato d'animo
    const moodMap = React.useMemo(() => {
        const map = new Map<string, string>();
        initialDays.forEach(d => { if (d.mood) map.set(d.fullDate, d.mood); });
        return map;
    }, [initialDays]);

    useEffect(() => {
        generateDays(startDate);
    }, [startDate, moodMap]);

    const formatLocalDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // Genera una finestra continua di 7 giorni a partire da startDate
    const generateDays = (start: Date) => {
        const newDays: CalendarDay[] = [];
        const todayStr = formatLocalDate(new Date());

        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            const dateString = formatLocalDate(date);
            const dayName = date.toLocaleDateString('it-IT', { weekday: 'short' });
            const dayNumber = date.getDate();

            const mood = moodMap.get(dateString);
            newDays.push({
                day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
                date: dayNumber,
                fullDate: dateString,
                hasEvent: !!mood,
                isToday: dateString === todayStr,
                mood,
            });
        }
        setDisplayDays(newDays);
    };

    const handlePrev = () => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() - 1);
        setStartDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + 1);
        setStartDate(newDate);
    };

    return (
        <div className="calendar-section">
            <div className="calendar-header">
                <button className="nav-arrow" onClick={handlePrev}>‹</button>
                <h2>Oggi</h2>
                <button className="nav-arrow" onClick={handleNext}>›</button>
            </div>

            <div className="days-container no-scrollbar">
                {displayDays.map((day, index) => {
                    const moodColor = getMoodColor(day.mood);
                    const isMoodDay = day.hasEvent && !day.isToday;
                    const style: React.CSSProperties = isMoodDay
                        ? {
                              backgroundColor: hexToRgba(moodColor, 0.15),
                              boxShadow: `0 4px 10px ${hexToRgba(moodColor, 0.25)}`,
                          }
                        : {};
                    return (
                        <div key={index} className={`day-item ${day.isToday ? 'active' : ''}`} style={style}>
                            {day.hasEvent && (
                                <div
                                    className="dot"
                                    style={{ backgroundColor: moodColor }}
                                ></div>
                            )}
                            <span className="day-name">{day.day}</span>
                            <span className="day-number">{day.date}</span>
                        </div>
                    );
                })}
            </div>

            <style>{`
                .calendar-section {
                    margin-bottom: 30px;
                }

                .calendar-header {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .calendar-header h2 {
                    font-size: 2rem;
                    font-weight: 800;
                }

                .nav-arrow {
                    background: none;
                    border: none;
                    font-size: 2rem;
                    color: var(--text-dark);
                    cursor: pointer;
                    padding: 0 10px;
                }

                .days-container {
                    display: flex;
                    justify-content: space-between;
                    overflow-x: auto;
                    padding: 0 20px;
                    gap: 10px;
                }

                .day-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-width: 45px;
                    height: 80px;
                    border-radius: 25px;
                    position: relative;
                    padding-top: 10px;
                }

                .day-item.active {
                    background-color: var(--white);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }

                .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: var(--text-gray); /* Default gray */
                    position: absolute;
                    top: 10px;
                }
                
                .dot-active {
                    /* No specific active style needed if color is dynamic, but keeping for structure */
                }

                .day-name {
                    font-size: 0.8rem;
                    color: var(--text-gray);
                    margin-bottom: 5px;
                }

                .day-number {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text-dark);
                }
            `}</style>
        </div>
    );
};

const getMoodColor = (mood?: string): string => {
    const m = mood?.toLowerCase();
    switch (m) {
        case 'felice': return '#4CAF50'; // Green
        case 'calmo': return '#4CAF50';
        case 'speranzoso': return '#43A047';
        case 'triste': return '#2196F3'; // Blue
        case 'ansia': return '#FF9800'; // Orange (generic)
        case 'ansioso': return '#FB8C00';
        case 'agitato': return '#F57C00';
        case 'stanco': return '#9E9E9E'; // Gray
        case 'apatico': return '#9E9E9E';
        case 'panico': return '#E53935'; // Red deep
        case 'rabbia': return '#F44336'; // Red
        case 'irritabile': return '#EF5350';
        case 'neutro': return '#9E9E9E'; // Gray
        default: return '#88b7b5'; // Default teal
    }
};

const hexToRgba = (hex: string, alpha: number): string => {
    // Expand shorthand form (e.g. "#03F") to full form (e.g. "#0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, function (_m, r, g, b) {
        return r + r + g + g + b + b;
    });
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    if (!match) return hex;
    const r = parseInt(match[1], 16);
    const g = parseInt(match[2], 16);
    const b = parseInt(match[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default Calendar;
