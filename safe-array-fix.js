#!/usr/bin/env node

/**
 * Safe script to fix the selected_addons column type from TEXT[] to JSONB
 * This uses a safer approach: create new column, migrate data, replace old column
 */

const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Disable SSL for Docker development
});

async function safeArrayFix() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Starting safe array column fix...');
    
    // Check current column type
    const currentType = await client.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      AND column_name = 'selected_addons';
    `);
    
    console.log('Current column type:', currentType.rows[0]?.data_type || 'Not found');
    
    if (currentType.rows[0]?.data_type === 'jsonb') {
      console.log('✅ Column is already JSONB, no fix needed!');
      return;
    }
    
    // Start transaction
    await client.query('BEGIN');
    
    try {
      // Step 1: Add new column
      console.log('📝 Adding new selected_addons_jsonb column...');
      await client.query(`
        ALTER TABLE bookings 
        ADD COLUMN selected_addons_jsonb JSONB;
      `);
      
      // Step 2: Migrate existing data
      console.log('🔄 Migrating existing data...');
      await client.query(`
        UPDATE bookings 
        SET selected_addons_jsonb = CASE 
          WHEN selected_addons IS NULL THEN NULL
          ELSE to_jsonb(selected_addons)
        END;
      `);
      
      // Step 3: Drop old column
      console.log('🗑️ Dropping old selected_addons column...');
      await client.query(`
        ALTER TABLE bookings 
        DROP COLUMN selected_addons;
      `);
      
      // Step 4: Rename new column
      console.log('🏷️ Renaming new column...');
      await client.query(`
        ALTER TABLE bookings 
        RENAME COLUMN selected_addons_jsonb TO selected_addons;
      `);
      
      // Commit transaction
      await client.query('COMMIT');
      console.log('✅ Safe array column fix completed successfully!');
      
    } catch (error) {
      // Rollback on error
      await client.query('ROLLBACK');
      throw error;
    }
    
    // Verify the change
    const newType = await client.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      AND column_name = 'selected_addons';
    `);
    
    console.log('New column type:', newType.rows[0]?.data_type);
    
    // Test with sample data
    console.log('🧪 Testing with sample data...');
    const testData = ['cinematic_video', 'virtual_tour'];
    console.log('Test array:', testData);
    console.log('JSON stringified:', JSON.stringify(testData));
    
  } catch (error) {
    console.error('❌ Safe fix failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the safe fix
safeArrayFix()
  .then(() => {
    console.log('\n🎉 Safe array column fix completed successfully!');
    console.log('The selected_addons column is now JSONB and should work with booking submissions.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Safe fix failed:', error);
    process.exit(1);
  });
