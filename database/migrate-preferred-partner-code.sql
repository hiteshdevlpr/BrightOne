-- Add preferred partner code column to bookings table
-- Run this on your existing database to support preferred partner pricing

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS preferred_partner_code VARCHAR(50);

-- Optional: index if you plan to filter/report by partner code
-- CREATE INDEX IF NOT EXISTS idx_bookings_preferred_partner_code ON bookings(preferred_partner_code);
