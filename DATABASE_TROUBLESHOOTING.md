# Database Connection Troubleshooting

## SSL Connection Error Fix

If you're seeing the error: `The server does not support SSL connections`, this is because the PostgreSQL server in Docker doesn't support SSL by default.

### ✅ Solution Applied

The database configuration has been updated to disable SSL for Docker development:

```typescript
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // Disable SSL for Docker development
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
});
```

## Testing Database Connection

### 1. Test Connection Script

Run the test script to verify database connectivity:

```bash
# From the project root
node test-db-connection.js
```

### 2. Check Docker Services

Make sure all services are running:

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs db
docker-compose logs app
```

### 3. Manual Database Connection

Connect directly to the database:

```bash
# Connect to PostgreSQL container
docker-compose exec db psql -U brightone -d brightone_db

# Test connection
SELECT NOW();
```

## Environment Variables

Make sure these environment variables are set:

```bash
DATABASE_URL=postgresql://brightone:brightone123@db:5432/brightone_db
NODE_ENV=development
```

## Common Issues and Solutions

### Issue 1: "Connection refused"
- **Cause**: Database service not running
- **Solution**: `docker-compose up -d db`

### Issue 2: "SSL not supported"
- **Cause**: SSL enabled for local Docker
- **Solution**: Already fixed in database.ts

### Issue 3: "Database does not exist"
- **Cause**: Database not initialized
- **Solution**: Check init.sql is mounted correctly

### Issue 4: "Authentication failed"
- **Cause**: Wrong credentials
- **Solution**: Verify DATABASE_URL matches docker-compose.yml

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Start only database
docker-compose up -d db

# View database logs
docker-compose logs -f db

# Restart database
docker-compose restart db

# Rebuild and restart
docker-compose up -d --build
```

## Database Schema

The database is initialized with the following tables:
- `users` - User accounts
- `bookings` - Booking requests
- `contact_messages` - Contact form submissions
- `portfolio_items` - Portfolio images

## Health Checks

The database service includes health checks:
- **Test**: `pg_isready -U brightone -d brightone_db`
- **Interval**: 10 seconds
- **Timeout**: 5 seconds
- **Retries**: 5 attempts

## Next Steps

1. Restart the Docker services: `docker-compose restart`
2. Test the connection: `node test-db-connection.js`
3. Check the application logs for successful connection
4. Try submitting a booking or contact form

The SSL issue should now be resolved! 🎉
