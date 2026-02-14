'use client';

import React, { useState, useMemo } from 'react';

interface BookingCalendarProps {
    selectedDate: string; // YYYY-MM-DD
    onDateSelect: (date: string) => void;
}

export default function BookingCalendar({ selectedDate, onDateSelect }: BookingCalendarProps) {
    // Current "view" start date (offset by 4 weeks for navigation)
    const [viewOffset, setViewOffset] = useState(0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Generate 28 days (4 weeks) based on viewOffset
    const calendarDays = useMemo(() => {
        const days = [];
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + (viewOffset * 28));

        for (let i = 0; i < 28; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);

            const dateString = d.toISOString().split('T')[0];
            const isSelected = dateString === selectedDate;
            const isPast = d < today;

            days.push({
                date: d,
                dateString,
                dayName: weekDays[d.getDay()],
                dayNumber: d.getDate(),
                isSelected,
                isPast,
                fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            });
        }
        return days;
    }, [viewOffset, selectedDate]);

    const handleNext = () => setViewOffset(prev => prev + 1);
    const handlePrev = () => setViewOffset(prev => Math.max(0, prev - 1));

    return (
        <div className="booking-calendar-wrapper">
            <div className="calendar-header d-flex justify-content-between align-items-center mb-3">
                <button
                    type="button"
                    className="pkg-btn-default btn-sm"
                    onClick={handlePrev}
                    disabled={viewOffset === 0}
                    style={{ opacity: viewOffset === 0 ? 0.5 : 1 }}
                >
                    &lt; Prev 4 Weeks
                </button>
                <span className="text-white font-priority">
                    {calendarDays[0].fullDate} - {calendarDays[calendarDays.length - 1].fullDate}
                </span>
                <button
                    type="button"
                    className="pkg-btn-default btn-sm"
                    onClick={handleNext}
                >
                    Next 4 Weeks &gt;
                </button>
            </div>

            <div className="calendar-grid">
                {calendarDays.map((day) => (
                    <button
                        key={day.dateString}
                        type="button"
                        className={`calendar-day-btn ${day.isSelected ? 'selected' : ''}`}
                        onClick={() => !day.isPast && onDateSelect(day.dateString)}
                        disabled={day.isPast}
                    >
                        <span className="day-name">{day.dayName}</span>
                        <span className="day-number">{day.dayNumber}</span>
                    </button>
                ))}
            </div>

            <style jsx>{`
                .booking-calendar-wrapper {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 20px;
                }
                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 10px;
                }
                .calendar-day-btn {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 10px 5px;
                    color: black;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .calendar-day-btn:hover:not(:disabled) {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                }
                .calendar-day-btn.selected {
                    background: #fff;
                    color: #000;
                    border-color: #fff;
                }
                .calendar-day-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                .day-name {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    opacity: 0.7;
                    margin-bottom: 4px;
                }
                .day-number {
                    font-size: 1.1rem;
                    font-weight: 600;
                }
                @media (max-width: 576px) {
                    .calendar-grid {
                        gap: 5px;
                    }
                    .day-name { font-size: 0.6rem; }
                    .day-number { font-size: 0.9rem; }
                }
            `}</style>
        </div>
    );
}
