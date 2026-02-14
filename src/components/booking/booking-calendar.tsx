'use client';

import React, { useState, useMemo } from 'react';

interface BookingCalendarProps {
    selectedDate: string; // YYYY-MM-DD
    onDateSelect: (date: string) => void;
}

export default function BookingCalendar({ selectedDate, onDateSelect }: BookingCalendarProps) {
    // Current "view" start date (offset by 2 weeks for navigation)
    const [viewOffset, setViewOffset] = useState(0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Generate 14 days (2 weeks) based on viewOffset
    const calendarDays = useMemo(() => {
        const days = [];
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + (viewOffset * 14));

        for (let i = 0; i < 14; i++) {
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
                    className=" btn-sm"
                    onClick={handlePrev}
                    disabled={viewOffset === 0}
                    style={{ opacity: viewOffset === 0 ? 0.5 : 1 }}
                >
                    &lt;&lt;
                </button>
                <span className="text-white font-priority calendar-range-label">
                    {calendarDays[0].fullDate} – {calendarDays[calendarDays.length - 1].fullDate}
                </span>
                <button
                    type="button"
                    className="btn-sm"
                    onClick={handleNext}
                >
                    &gt;&gt;
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
                    border-radius: 10px;
                    padding: 14px;
                    width: 100%;
                }
                .calendar-header {
                    margin-bottom: 12px !important;
                }
                .calendar-header .btn-sm {
                    font-size: 12px;
                    padding: 6px 10px;
                }
                .calendar-range-label {
                    font-size: 13px;
                }
                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 6px;
                }
                .calendar-day-btn {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    padding: 6px 4px;
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
                    border: 2px solid #1a1a1a;
                    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
                }
                .calendar-day-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                .day-name {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    opacity: 0.7;
                    margin-bottom: 2px;
                }
                .day-number {
                    font-size: 0.95rem;
                    font-weight: 600;
                }
                @media (max-width: 576px) {
                    .booking-calendar-wrapper {
                        padding: 10px;
                    }
                    .calendar-grid {
                        gap: 4px;
                    }
                    .calendar-day-btn {
                        padding: 5px 2px;
                    }
                    .day-name { font-size: 0.55rem; }
                    .day-number { font-size: 0.85rem; }
                }
            `}</style>
        </div>
    );
}
