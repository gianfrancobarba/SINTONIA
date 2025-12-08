import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CalendarDay } from '../types/home';
import { MOOD_CONFIGS } from '../types/mood';
import '../css/Calendar.css';
import LeftArrowIcon from '../assets/icons/LeftArrow.svg';
import RightArrowIcon from '../assets/icons/RightArrow.svg';

interface CalendarProps {
    days: CalendarDay[]; // Initial data from backend
}

const Calendar: React.FC<CalendarProps> = ({ days: initialDays }) => {
    const navigate = useNavigate();

    // Helper to get Monday of the week for a given date
    const getMonday = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(date.setDate(diff));
    };

    const [startDate, setStartDate] = useState(getMonday(new Date()));
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

    // Handler per il click sul giorno "oggi"
    const handleDayClick = (day: CalendarDay) => {
        if (day.isToday) {
            navigate('/mood-entry');
        }
    };

    // Mappa data (YYYY-MM-DD) -> mood
    const moodMap = React.useMemo(() => {
        const map = new Map<string, string>();
        initialDays.forEach(d => { if (d.mood) map.set(d.fullDate, d.mood); });
        return map;
    }, [initialDays]);

    const formatLocalDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // Genera i giorni per una data settimana
    const generateDaysForWeek = (start: Date) => {
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
        return newDays;
    };

    const handlePrev = () => {
        if (isAnimating) return;
        setSlideDirection('right');
        setIsAnimating(true);
        setTimeout(() => {
            const newDate = new Date(startDate);
            newDate.setDate(startDate.getDate() - 7);
            setStartDate(newDate);
            setIsAnimating(false);
            setSlideDirection(null);
        }, 300); // Match CSS transition duration
    };

    const handleNext = () => {
        if (isAnimating) return;
        setSlideDirection('left');
        setIsAnimating(true);
        setTimeout(() => {
            const newDate = new Date(startDate);
            newDate.setDate(startDate.getDate() + 7);
            setStartDate(newDate);
            setIsAnimating(false);
            setSlideDirection(null);
        }, 300); // Match CSS transition duration
    };

    // Swipe handling
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
    };

    // Determine which weeks to render based on animation state
    const currentWeekDays = generateDaysForWeek(startDate);
    let prevWeekDays: CalendarDay[] = [];
    let nextWeekDays: CalendarDay[] = [];

    if (slideDirection === 'right') {
        const prevDate = new Date(startDate);
        prevDate.setDate(startDate.getDate() - 7);
        prevWeekDays = generateDaysForWeek(prevDate);
    } else if (slideDirection === 'left') {
        const nextDate = new Date(startDate);
        nextDate.setDate(startDate.getDate() + 7);
        nextWeekDays = generateDaysForWeek(nextDate);
    }

    // Format header date range
    const formatWeekRange = () => {
        // If animating, show the target week's date? Or keep current?
        // Keeping current is safer to avoid jumpiness, or update if we want.
        // Let's keep current startDate logic for header.
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleDateString('it-IT', { month: 'short' });
        const endDay = endDate.getDate();
        const endMonth = endDate.toLocaleDateString('it-IT', { month: 'short' });

        if (startDate.getMonth() === endDate.getMonth()) {
            return `${startDay} - ${endDay} ${startMonth}`;
        }
        return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
    };

    const renderWeek = (days: CalendarDay[]) => (
        <div className="week-view">
            {days.map((day, index) => {
                const moodColor = getMoodColor(day.mood);
                return (
                    <div
                        key={index}
                        className={`day-item ${day.isToday ? 'active' : ''}`}
                        onClick={() => handleDayClick(day)}
                        style={{ cursor: day.isToday ? 'pointer' : 'default' }}
                    >
                        <div className="mood-indicator-container">
                            {day.isToday && !day.hasEvent ? (
                                <div className="add-mood-indicator">+</div>
                            ) : (
                                <div
                                    className="dot"
                                    style={{ backgroundColor: day.hasEvent ? moodColor : 'transparent' }}
                                ></div>
                            )}
                        </div>
                        <span className="day-number">{day.date}</span>
                        <span className="day-name">{day.day}</span>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="calendar-section">
            <div className="calendar-card">
                <div className="calendar-header">
                    <button className="nav-arrow" onClick={handlePrev}>
                        <img src={LeftArrowIcon} alt="Previous week" />
                    </button>
                    <h2>{formatWeekRange()}</h2>
                    <button className="nav-arrow" onClick={handleNext}>
                        <img src={RightArrowIcon} alt="Next week" />
                    </button>
                </div>

                <div
                    className="calendar-viewport"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div className={`calendar-track ${slideDirection ? `animating-${slideDirection}` : ''}`}>
                        {slideDirection === 'right' && renderWeek(prevWeekDays)}
                        {renderWeek(currentWeekDays)}
                        {slideDirection === 'left' && renderWeek(nextWeekDays)}
                    </div>
                </div>
            </div>
        </div>
    );
};

const getMoodColor = (mood?: string): string => {
    if (!mood) return '#88b7b5';
    const config = MOOD_CONFIGS.find(c => c.umore.toLowerCase() === mood.toLowerCase());
    return config ? config.color : '#88b7b5';
};

export default Calendar;
