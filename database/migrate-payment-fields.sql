-- Add payment fields to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR(255);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';

-- Create index on payment_intent_id for lookups
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent_id ON bookings(payment_intent_id);
