# Database Migration via curl

This document shows how to run the database migration using curl commands.

## Prerequisites

1. **Start your Next.js server**:
   ```bash
   npm run dev
   ```

2. **Set your migration token** (optional, defaults to `migrate-brightone-2024`):
   ```bash
   export MIGRATION_TOKEN="your-secure-token-here"
   ```

## curl Commands

### 1. Check Migration Status

```bash
curl -H "Authorization: Bearer migrate-brightone-2024" \
     http://localhost:3000/api/migrate
```

**Response** (if migration is pending):
```json
{
  "success": true,
  "migration": {
    "name": "price-breakdown-migration",
    "status": "pending",
    "columns": [],
    "isComplete": false
  }
}
```

**Response** (if migration is completed):
```json
{
  "success": true,
  "migration": {
    "name": "price-breakdown-migration", 
    "status": "completed",
    "columns": [
      {
        "column": "package_price",
        "type": "numeric",
        "nullable": true,
        "default": null
      }
      // ... more columns
    ],
    "isComplete": true
  }
}
```

### 2. Run Migration

```bash
curl -X POST \
     -H "Authorization: Bearer migrate-brightone-2024" \
     http://localhost:3000/api/migrate
```

**Response** (success):
```json
{
  "success": true,
  "message": "Price breakdown migration completed successfully!",
  "migration": {
    "name": "price-breakdown-migration",
    "description": "Adds detailed pricing columns to bookings table",
    "columnsAdded": [
      "package_price (DECIMAL)",
      "addons_price (DECIMAL)",
      "subtotal (DECIMAL)", 
      "tax_rate (DECIMAL, default 13.00)",
      "tax_amount (DECIMAL)",
      "final_total (DECIMAL)",
      "price_breakdown (JSONB)"
    ],
    "verification": [
      {
        "column": "package_price",
        "type": "numeric",
        "nullable": true,
        "default": null
      }
      // ... verification details
    ]
  }
}
```

### 3. Using the Shell Script

For convenience, you can use the provided shell script:

```bash
./run-migration-curl.sh
```

This script will:
- Check if the server is running
- Check current migration status
- Run the migration if needed
- Display results

## Environment Variables

You can customize the migration by setting these environment variables:

```bash
# Migration token for authentication
export MIGRATION_TOKEN="your-secure-token"

# Server URL (default: http://localhost:3000)
export SERVER_URL="https://your-domain.com"
```

## Security Notes

- The migration endpoint requires authentication via Bearer token
- Change the default token in production
- Consider adding additional security measures for production use
- The migration endpoint should only be accessible to authorized users

## Troubleshooting

### Server Not Running
```
❌ Server is not running or migration endpoint is not accessible
```
**Solution**: Start your Next.js server with `npm run dev`

### Unauthorized Error
```
{"error": "Unauthorized. Migration token required."}
```
**Solution**: Include the correct Authorization header with your request

### Migration Already Completed
```
✅ Migration is already completed
```
**Solution**: The migration has already been run. No action needed.

## Production Deployment

For production deployments, you might want to:

1. **Use a secure token**:
   ```bash
   export MIGRATION_TOKEN="$(openssl rand -hex 32)"
   ```

2. **Use HTTPS**:
   ```bash
   curl -X POST \
        -H "Authorization: Bearer $MIGRATION_TOKEN" \
        https://your-domain.com/api/migrate
   ```

3. **Add to CI/CD pipeline**:
   ```yaml
   - name: Run Database Migration
     run: |
       curl -X POST \
            -H "Authorization: Bearer ${{ secrets.MIGRATION_TOKEN }}" \
            ${{ secrets.SERVER_URL }}/api/migrate
   ```
