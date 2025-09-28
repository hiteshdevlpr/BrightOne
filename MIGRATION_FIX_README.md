# Database Migration Fix

## Problem
The production database was missing the `total_price` column, causing the migration script to fail with the error:
```
"error": "column \"total_price\" does not exist"
```

## Root Cause
There were two separate migration scripts that needed to be run in sequence:
1. `migrate-database.sql` - Adds basic columns including `total_price`
2. `migrate-price-breakdown.sql` - Adds detailed pricing columns and references `total_price`

The curl script was trying to run only the second migration, which failed because it referenced the non-existent `total_price` column.

## Solution
Created a comprehensive migration script that runs both migrations in the correct order:

### Files Created/Updated:
1. **`migrate-complete.sql`** - Complete migration script that handles both migrations
2. **`run-complete-migration.js`** - Node.js script to run the complete migration
3. **`src/app/api/migrate/route.ts`** - Updated API endpoint to use the complete migration
4. **`run-migration-curl.sh`** - Updated curl script messages

## How to Run the Migration

### Option 1: Using the API endpoint (Recommended for Production)
```bash
# Make sure your server is running
npm run dev

# Run the migration via curl
./run-migration-curl.sh
```

### Option 2: Direct Node.js script
```bash
# Set your DATABASE_URL environment variable
export DATABASE_URL="your_database_connection_string"

# Run the migration script
node run-complete-migration.js
```

### Option 3: Direct SQL execution
```bash
# Connect to your database and run:
psql $DATABASE_URL -f migrate-complete.sql
```

## What the Migration Does

### Step 1: Adds Basic Columns
- `selected_addons` (TEXT[] -> JSONB)
- `preferred_date` (VARCHAR)
- `preferred_time` (VARCHAR)
- `total_price` (VARCHAR)

### Step 2: Adds Price Breakdown Columns
- `package_price` (DECIMAL)
- `addons_price` (DECIMAL)
- `subtotal` (DECIMAL)
- `tax_rate` (DECIMAL, default 13.00)
- `tax_amount` (DECIMAL)
- `final_total` (DECIMAL)
- `price_breakdown` (JSONB)

### Step 3: Updates Existing Records
- Sets default values for new columns
- Migrates existing `total_price` values to the new pricing structure
- Converts `selected_addons` from TEXT[] to JSONB for better performance

### Step 4: Creates Indexes
- Performance indexes on frequently queried columns

## Verification
The migration script includes verification steps that will:
- Show all columns in the bookings table
- Confirm all expected columns are present
- Display column types and constraints

## Environment Variables Required
- `DATABASE_URL` - Your PostgreSQL connection string
- `MIGRATION_TOKEN` - Token for API authentication (default: "migrate-brightone-2024")

## Troubleshooting

### If migration fails:
1. Check your `DATABASE_URL` is correct
2. Ensure you have proper database permissions
3. Check the error logs for specific issues
4. Verify the database connection is working

### If columns already exist:
The migration uses `ADD COLUMN IF NOT EXISTS` so it's safe to run multiple times.

### If you need to rollback:
The migration only adds columns and doesn't modify existing data, so rollback would require manually dropping the added columns if needed.

## Success Indicators
After successful migration, you should see:
- All 11 expected columns in the bookings table
- No error messages
- Confirmation message with column verification
