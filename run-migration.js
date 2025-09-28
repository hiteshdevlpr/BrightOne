#!/usr/bin/env node

// Database migration script
// Run this script to add the new columns to your existing database

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Disable SSL for Docker development
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

async function runMigration() {
  let client;
  
  try {
    console.log('🔄 Starting database migration...');
    console.log('📊 DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    // Connect to database
    client = await pool.connect();
    console.log('✅ Connected to database');
    
    // Read migration SQL file
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'migrate-database.sql'), 'utf8');
    
    // Execute migration
    console.log('🔧 Executing migration...');
    await client.query(migrationSQL);
    console.log('✅ Migration completed successfully!');
    
    // Verify the changes
    console.log('🔍 Verifying changes...');
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Current bookings table structure:');
    console.table(result.rows);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigration };
