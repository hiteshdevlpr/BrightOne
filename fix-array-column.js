#!/usr/bin/env node

/**
 * Script to fix the selected_addons column type from TEXT[] to JSONB
 * This resolves the "malformed array literal" error
 */

const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Disable SSL for Docker development
});

async function fixArrayColumn() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Fixing selected_addons column type...');
    
    // Check current column type
    const currentType = await client.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      AND column_name = 'selected_addons';
    `);
    
    console.log('Current column type:', currentType.rows[0]?.data_type || 'Not found');
    
    // Fix the column type with proper conversion
    await client.query(`
      ALTER TABLE bookings 
      ALTER COLUMN selected_addons TYPE JSONB 
      USING CASE 
        WHEN selected_addons IS NULL THEN NULL
        ELSE to_jsonb(selected_addons)
      END;
    `);
    
    console.log('✅ Column type fixed successfully!');
    
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
    console.error('❌ Fix failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the fix
fixArrayColumn()
  .then(() => {
    console.log('\n🎉 Array column fix completed successfully!');
    console.log('The selected_addons column is now JSONB and should work with booking submissions.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fix failed:', error);
    process.exit(1);
  });
