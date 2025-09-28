-- Fix for selected_addons array column issue
-- Change from TEXT[] to JSONB for better compatibility

-- First, let's see what the current data looks like
SELECT selected_addons FROM bookings LIMIT 5;

-- Update the column type to JSONB with proper conversion
ALTER TABLE bookings 
ALTER COLUMN selected_addons TYPE JSONB 
USING CASE 
  WHEN selected_addons IS NULL THEN NULL
  ELSE to_jsonb(selected_addons)
END;

-- Add a comment
COMMENT ON COLUMN bookings.selected_addons IS 'Selected add-ons as JSONB array for better compatibility';
