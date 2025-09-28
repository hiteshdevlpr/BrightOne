import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import fs from 'fs';
import path from 'path';

// POST /api/migrate - Run database migrations
export async function POST(request: NextRequest) {
  try {
    // Check for authorization (you might want to add proper auth here)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.MIGRATION_TOKEN || 'migrate-brightone-2024';
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized. Migration token required.' },
        { status: 401 }
      );
    }

    console.log('Starting price breakdown migration via API...');

    // Read the migration SQL file
    const migrationPath = path.join(process.cwd(), 'migrate-price-breakdown.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    await query(migrationSQL);

    // Also fix the selected_addons column type
    console.log('Fixing selected_addons column type...');
    await query(`
      ALTER TABLE bookings 
      ALTER COLUMN selected_addons TYPE JSONB 
      USING CASE 
        WHEN selected_addons IS NULL THEN NULL
        ELSE to_jsonb(selected_addons)
      END;
    `);

    console.log('✅ Price breakdown migration completed successfully via API!');

    // Verify the migration
    const result = await query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      AND column_name IN ('package_price', 'addons_price', 'subtotal', 'tax_rate', 'tax_amount', 'final_total', 'price_breakdown')
      ORDER BY column_name;
    `);

    const migrationResults = result.rows.map(row => ({
      column: row.column_name,
      type: row.data_type,
      nullable: row.is_nullable === 'YES',
      default: row.column_default
    }));

    return NextResponse.json({
      success: true,
      message: 'Price breakdown migration completed successfully!',
      migration: {
        name: 'price-breakdown-migration',
        description: 'Adds detailed pricing columns to bookings table',
        columnsAdded: [
          'package_price (DECIMAL)',
          'addons_price (DECIMAL)', 
          'subtotal (DECIMAL)',
          'tax_rate (DECIMAL, default 13.00)',
          'tax_amount (DECIMAL)',
          'final_total (DECIMAL)',
          'price_breakdown (JSONB)'
        ],
        verification: migrationResults
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Migration failed via API:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Migration failed',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// GET /api/migrate - Check migration status
export async function GET(request: NextRequest) {
  try {
    // Check for authorization
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.MIGRATION_TOKEN || 'migrate-brightone-2024';
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized. Migration token required.' },
        { status: 401 }
      );
    }

    // Check if migration columns exist
    const result = await query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      AND column_name IN ('package_price', 'addons_price', 'subtotal', 'tax_rate', 'tax_amount', 'final_total', 'price_breakdown')
      ORDER BY column_name;
    `);

    const migrationColumns = result.rows.map(row => ({
      column: row.column_name,
      type: row.data_type,
      nullable: row.is_nullable === 'YES',
      default: row.column_default
    }));

    const isMigrated = migrationColumns.length === 7; // All 7 columns should exist

    return NextResponse.json({
      success: true,
      migration: {
        name: 'price-breakdown-migration',
        status: isMigrated ? 'completed' : 'pending',
        columns: migrationColumns,
        isComplete: isMigrated
      }
    });

  } catch (error) {
    console.error('❌ Migration status check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check migration status'
    }, { status: 500 });
  }
}