#!/bin/bash

# Script to run database migration via curl
# This demonstrates how to trigger the migration using HTTP requests

# Configuration
BASE_URL="http://localhost:3000"  # Change this to your server URL
MIGRATION_TOKEN="migrate-brightone-2024"  # Change this to your actual token

echo "🚀 Running BrightOne Database Migration via curl"
echo "================================================"

# Check if server is running
echo "📡 Checking if server is running..."
if ! curl -s -f "$BASE_URL/api/migrate" -H "Authorization: Bearer $MIGRATION_TOKEN" > /dev/null 2>&1; then
    echo "❌ Server is not running or migration endpoint is not accessible"
    echo "   Make sure your Next.js server is running on $BASE_URL"
    echo "   You can start it with: npm run dev"
    exit 1
fi

echo "✅ Server is running"

# Check migration status first
echo ""
echo "🔍 Checking current migration status..."
STATUS_RESPONSE=$(curl -s -H "Authorization: Bearer $MIGRATION_TOKEN" "$BASE_URL/api/migrate")

if echo "$STATUS_RESPONSE" | grep -q '"isComplete": true'; then
    echo "✅ Migration is already completed"
    echo "$STATUS_RESPONSE" | jq '.migration' 2>/dev/null || echo "$STATUS_RESPONSE"
    exit 0
fi

echo "📋 Current status:"
echo "$STATUS_RESPONSE" | jq '.migration' 2>/dev/null || echo "$STATUS_RESPONSE"

# Run the migration
echo ""
echo "🔄 Running complete database migration..."
MIGRATION_RESPONSE=$(curl -s -X POST -H "Authorization: Bearer $MIGRATION_TOKEN" "$BASE_URL/api/migrate")

if echo "$MIGRATION_RESPONSE" | grep -q '"success": true'; then
    echo "✅ Migration completed successfully!"
    echo ""
    echo "📊 Migration Results:"
    echo "$MIGRATION_RESPONSE" | jq '.migration' 2>/dev/null || echo "$MIGRATION_RESPONSE"
    
    echo ""
    echo "🎉 Database is now ready with all required columns and functionality!"
else
    echo "❌ Migration failed!"
    echo "$MIGRATION_RESPONSE" | jq '.error' 2>/dev/null || echo "$MIGRATION_RESPONSE"
    exit 1
fi
