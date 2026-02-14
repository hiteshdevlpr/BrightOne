'use client';

import React, { useState, useEffect } from 'react';

interface TimeSlotGridProps {
    selectedDate: string | null;
    selectedTime: string | null;
    onTimeSelect: (time: string) => void;
}

export default function TimeSlotGrid({ selectedDate, selectedTime, onTimeSelect }: TimeSlotGridProps) {
    const [slots, setSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedDate) {
            setSlots([]);
            return;
        }

        async function fetchSlots() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/availability?date=${selectedDate}`);
                if (!res.ok) throw new Error('Failed to fetch slots');
                const data = await res.json();
                setSlots(data.availableSlots || []);
            } catch (err) {
                console.error(err);
                setError('Could not load availability. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchSlots();
    }, [selectedDate]);

    if (!selectedDate) {
        return <div className="text-center text-white-50 mt-4">Please select a date above to see available times.</div>;
    }

    if (loading) {
        return (
            <div className="text-center mt-4">
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-danger mt-4">{error}</div>;
    }

    if (slots.length === 0) {
        return <div className="text-center text-white-50 mt-4">No available slots for this date.</div>;
    }

    return (
        <div className="time-slot-grid-wrapper mt-4">
            <h5 className="text-white mb-3">Available Start Times</h5>
            <div className="slots-grid">
                {slots.map((time) => (
                    <button
                        key={time}
                        type="button"
                        className={`slot-btn ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => onTimeSelect(time)}
                    >
                        {time}
                    </button>
                ))}
            </div>

            <style jsx>{`
                .slots-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                    gap: 12px;
                }
                .slot-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    padding: 10px;
                    color: black;
                    transition: all 0.2s;
                }
                .slot-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: white;
                }
                .slot-btn.selected {
                    background: white;
                    color: black;
                    border: 2px solid #1a1a1a;
                    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
}
