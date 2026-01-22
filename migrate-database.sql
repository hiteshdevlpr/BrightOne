-- Migration script to add new columns to existing bookings table
-- Run this script on your existing database to add the new fields

-- Add new columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS selected_addons TEXT[],
ADD COLUMN IF NOT EXISTS preferred_date VARCHAR(50),
ADD COLUMN IF NOT EXISTS preferred_time VARCHAR(50),
ADD COLUMN IF NOT EXISTS total_price VARCHAR(50);

-- Create indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_bookings_selected_addons ON bookings USING GIN(selected_addons);
CREATE INDEX IF NOT EXISTS idx_bookings_preferred_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_total_price ON bookings(total_price);

-- Update any existing records to have default values (optional)
-- UPDATE bookings SET selected_addons = '{}' WHERE selected_addons IS NULL;
-- UPDATE bookings SET preferred_date = 'Not specified' WHERE preferred_date IS NULL;
-- UPDATE bookings SET preferred_time = 'Not specified' WHERE preferred_time IS NULL;
-- UPDATE bookings SET total_price = 'To be determined' WHERE total_price IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;
