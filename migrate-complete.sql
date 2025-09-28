-- Complete migration script for BrightOne database
-- This script runs both the basic migration and price breakdown migration in the correct order
-- Run this script to ensure all required columns exist before running price breakdown migration

-- ============================================
-- STEP 1: Add basic columns (if they don't exist)
-- ============================================

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

-- ============================================
-- STEP 2: Add price breakdown columns
-- ============================================

-- Add new columns for price breakdown
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS package_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS addons_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 13.00,
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS final_total DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS price_breakdown JSONB;

-- Add index for price breakdown queries
CREATE INDEX IF NOT EXISTS idx_bookings_final_total ON bookings(final_total);
CREATE INDEX IF NOT EXISTS idx_bookings_package_price ON bookings(package_price);

-- ============================================
-- STEP 3: Update existing records with default values
-- ============================================

-- Update existing records to have default values for basic columns
UPDATE bookings 
SET 
  selected_addons = '{}' 
WHERE selected_addons IS NULL;

UPDATE bookings 
SET 
  preferred_date = 'Not specified' 
WHERE preferred_date IS NULL;

UPDATE bookings 
SET 
  preferred_time = 'Not specified' 
WHERE preferred_time IS NULL;

UPDATE bookings 
SET 
  total_price = 'To be determined' 
WHERE total_price IS NULL;

-- Update existing records to populate price breakdown columns
-- Only update if total_price contains a valid number
UPDATE bookings 
SET 
  package_price = CASE 
    WHEN total_price ~ '^[0-9]+\.?[0-9]*$' THEN CAST(total_price AS DECIMAL(10,2))
    ELSE 0.00
  END,
  addons_price = 0.00,
  subtotal = CASE 
    WHEN total_price ~ '^[0-9]+\.?[0-9]*$' THEN CAST(total_price AS DECIMAL(10,2))
    ELSE 0.00
  END,
  tax_amount = CASE 
    WHEN total_price ~ '^[0-9]+\.?[0-9]*$' THEN CAST(total_price AS DECIMAL(10,2)) * 0.13
    ELSE 0.00
  END,
  final_total = CASE 
    WHEN total_price ~ '^[0-9]+\.?[0-9]*$' THEN CAST(total_price AS DECIMAL(10,2)) * 1.13
    ELSE 0.00
  END
WHERE package_price IS NULL;

-- ============================================
-- STEP 4: Add column comments for documentation
-- ============================================

COMMENT ON COLUMN bookings.selected_addons IS 'Array of selected add-on services';
COMMENT ON COLUMN bookings.preferred_date IS 'Customer preferred service date';
COMMENT ON COLUMN bookings.preferred_time IS 'Customer preferred service time';
COMMENT ON COLUMN bookings.total_price IS 'Total price as string (legacy field)';
COMMENT ON COLUMN bookings.package_price IS 'Base price of the selected package';
COMMENT ON COLUMN bookings.addons_price IS 'Total price of selected add-ons';
COMMENT ON COLUMN bookings.subtotal IS 'Package price + add-ons price (before tax)';
COMMENT ON COLUMN bookings.tax_rate IS 'Tax rate percentage (default 13% for Ontario)';
COMMENT ON COLUMN bookings.tax_amount IS 'Tax amount calculated from subtotal';
COMMENT ON COLUMN bookings.final_total IS 'Final total including tax';
COMMENT ON COLUMN bookings.price_breakdown IS 'JSON object with detailed price breakdown';

-- ============================================
-- STEP 5: Verify the migration
-- ============================================

-- Show all columns in the bookings table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;
