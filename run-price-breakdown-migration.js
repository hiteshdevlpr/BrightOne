#!/usr/bin/env node

/**
 * Script to run the price breakdown database migration
 * This adds new columns for detailed pricing information including tax calculation
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Disable SSL for Docker development
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting price breakdown migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'migrate-price-breakdown.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    // Also fix the selected_addons column type
    console.log('Fixing selected_addons column type...');
    await client.query(`
      ALTER TABLE bookings 
      ALTER COLUMN selected_addons TYPE JSONB 
      USING CASE 
        WHEN selected_addons IS NULL THEN NULL
        ELSE to_jsonb(selected_addons)
      END;
    `);
    
    console.log('✅ Price breakdown migration completed successfully!');
    console.log('Added columns:');
    console.log('  - package_price (DECIMAL)');
    console.log('  - addons_price (DECIMAL)');
    console.log('  - subtotal (DECIMAL)');
    console.log('  - tax_rate (DECIMAL, default 13.00)');
    console.log('  - tax_amount (DECIMAL)');
    console.log('  - final_total (DECIMAL)');
    console.log('  - price_breakdown (JSONB)');
    
    // Verify the migration
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      AND column_name IN ('package_price', 'addons_price', 'subtotal', 'tax_rate', 'tax_amount', 'final_total', 'price_breakdown')
      ORDER BY column_name;
    `);
    
    console.log('\n📋 Migration verification:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}, default: ${row.column_default || 'none'})`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
