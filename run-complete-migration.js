#!/usr/bin/env node

/**
 * Script to run the complete database migration
 * This runs both the basic migration and price breakdown migration in the correct order
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Disable SSL for Docker development
});

async function runCompleteMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting complete database migration...');
    console.log('📊 DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    // Read the complete migration SQL file
    const migrationPath = path.join(__dirname, 'migrate-complete.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the complete migration
    console.log('🔧 Executing complete migration...');
    await client.query(migrationSQL);
    
    // Also fix the selected_addons column type to JSONB for better performance
    console.log('🔧 Converting selected_addons to JSONB...');
    await client.query(`
      ALTER TABLE bookings 
      ALTER COLUMN selected_addons TYPE JSONB 
      USING CASE 
        WHEN selected_addons IS NULL THEN NULL
        ELSE to_jsonb(selected_addons)
      END;
    `);
    
    console.log('✅ Complete database migration completed successfully!');
    console.log('');
    console.log('📋 Added/Updated columns:');
    console.log('  Basic columns:');
    console.log('    - selected_addons (TEXT[] -> JSONB)');
    console.log('    - preferred_date (VARCHAR)');
    console.log('    - preferred_time (VARCHAR)');
    console.log('    - total_price (VARCHAR)');
    console.log('  Price breakdown columns:');
    console.log('    - package_price (DECIMAL)');
    console.log('    - addons_price (DECIMAL)');
    console.log('    - subtotal (DECIMAL)');
    console.log('    - tax_rate (DECIMAL, default 13.00)');
    console.log('    - tax_amount (DECIMAL)');
    console.log('    - final_total (DECIMAL)');
    console.log('    - price_breakdown (JSONB)');
    
    // Verify the migration
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      AND column_name IN ('selected_addons', 'preferred_date', 'preferred_time', 'total_price', 'package_price', 'addons_price', 'subtotal', 'tax_rate', 'tax_amount', 'final_total', 'price_breakdown')
      ORDER BY column_name;
    `);
    
    console.log('');
    console.log('🔍 Migration verification:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}, default: ${row.column_default || 'none'})`);
    });
    
    // Check if all expected columns exist
    const expectedColumns = ['selected_addons', 'preferred_date', 'preferred_time', 'total_price', 'package_price', 'addons_price', 'subtotal', 'tax_rate', 'tax_amount', 'final_total', 'price_breakdown'];
    const existingColumns = result.rows.map(row => row.column_name);
    const missingColumns = expectedColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length === 0) {
      console.log('');
      console.log('✅ All expected columns are present!');
    } else {
      console.log('');
      console.log('⚠️  Missing columns:', missingColumns.join(', '));
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
runCompleteMigration()
  .then(() => {
    console.log('');
    console.log('🎉 Complete migration completed successfully!');
    console.log('Your database is now ready with all required columns.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('');
    console.error('💥 Migration failed:', error.message);
    process.exit(1);
  });
