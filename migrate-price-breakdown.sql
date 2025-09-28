-- Migration to add price breakdown fields to bookings table
-- This adds detailed pricing information including tax calculation

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

-- Update existing records to have default values
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

-- Add comments for documentation
COMMENT ON COLUMN bookings.package_price IS 'Base price of the selected package';
COMMENT ON COLUMN bookings.addons_price IS 'Total price of selected add-ons';
COMMENT ON COLUMN bookings.subtotal IS 'Package price + add-ons price (before tax)';
COMMENT ON COLUMN bookings.tax_rate IS 'Tax rate percentage (default 13% for Ontario)';
COMMENT ON COLUMN bookings.tax_amount IS 'Tax amount calculated from subtotal';
COMMENT ON COLUMN bookings.final_total IS 'Final total including tax';
COMMENT ON COLUMN bookings.price_breakdown IS 'JSON object with detailed price breakdown';
