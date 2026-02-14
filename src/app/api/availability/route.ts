import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { GENERATED_SLOTS } from '@/lib/availability-config';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateString(s: string): boolean {
    if (!DATE_ONLY_REGEX.test(s)) return false;
    const d = new Date(s);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date'); // Expected format: YYYY-MM-DD

    if (!date) {
        return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }
    if (!isValidDateString(date)) {
        return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
    }

    try {
        // Query existing bookings for this date that are NOT cancelled
        // Note: Using a simple string match for preferred_date. 
        // Ensure frontend sends YYYY-MM-DD to match stored format if applicable.
        const result = await query(
            `SELECT preferred_time 
             FROM bookings 
             WHERE preferred_date = $1 
             AND status != 'cancelled'
             AND status != 'declined'`,
            [date]
        );

        const bookedTimes = result.rows.map((row: { preferred_time: string }) => row.preferred_time);

        // Filter valid slots
        const availableSlots = GENERATED_SLOTS.filter(slot => !bookedTimes.includes(slot));

        return NextResponse.json({
            date,
            availableSlots,
            totalSlots: GENERATED_SLOTS.length,
            bookedCount: bookedTimes.length
        });
    } catch (error) {
        console.error('Error fetching availability:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
