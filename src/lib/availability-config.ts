export const AVAILABILITY_CONFIG = {
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    operationalDays: [0, 1, 2, 3, 4, 5, 6], // All 7 days

    // 24-hour format
    startHour: 9, // 9 AM
    endHour: 18,  // 6 PM

    // Duration in minutes (for display/logic, though we currently use fixed slots)
    slotDurationMinutes: 60,

    // Timezone
    timeZone: 'America/Toronto', // Adjust if needed
};

export const GENERATED_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export function isDateBookable(date: Date): boolean {
    const day = date.getDay();
    return AVAILABILITY_CONFIG.operationalDays.includes(day);
}
