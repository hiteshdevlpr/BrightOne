# Docker Setup for BrightOne.ca

This project is now containerized using Docker and Docker Compose with PostgreSQL database support.

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Git

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in the project root with the following variables:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Database Configuration (for local development)
DATABASE_URL=postgresql://brightone:brightone123@localhost:5432/brightone_db

# Application Configuration
NODE_ENV=development
PORT=3000
```

### 2. Production Deployment

To run the application in production mode:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Development Mode

To run the application in development mode with hot reload:

```bash
# Build and start development services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development services
docker-compose -f docker-compose.dev.yml down
```

## Services

### Application (app)
- **Port**: 3000
- **Environment**: Production/Development
- **Dependencies**: PostgreSQL, Redis

### PostgreSQL Database (db)
- **Port**: 5432
- **Database**: brightone_db
- **Username**: brightone
- **Password**: brightone123
- **Health Check**: Enabled

### Redis Cache (redis)
- **Port**: 6379
- **Purpose**: Caching and session storage
- **Persistence**: Enabled with AOF

## Database Schema

The database is automatically initialized with the following tables:

- `users` - User accounts
- `bookings` - Service booking requests
- `contact_messages` - Contact form submissions
- `portfolio_items` - Portfolio gallery items

## Useful Commands

### Container Management

```bash
# Rebuild containers
docker-compose build

# Rebuild and restart
docker-compose up -d --build

# View running containers
docker-compose ps

# Access application logs
docker-compose logs app

# Access database logs
docker-compose logs db
```

### Database Operations

```bash
# Connect to PostgreSQL
docker-compose exec db psql -U brightone -d brightone_db

# Backup database
docker-compose exec db pg_dump -U brightone brightone_db > backup.sql

# Restore database
docker-compose exec -T db psql -U brightone -d brightone_db < backup.sql
```

### Development Commands

```bash
# Install new npm packages
docker-compose exec app npm install package-name

# Run database migrations (if you add them later)
docker-compose exec app npm run migrate

# Run tests
docker-compose exec app npm test
```

## File Structure

```
├── Dockerfile              # Production container
├── Dockerfile.dev          # Development container
├── docker-compose.yml      # Production services
├── docker-compose.dev.yml  # Development services
├── .dockerignore           # Docker build context exclusions
├── init.sql               # Database initialization
└── DOCKER_README.md       # This file
```

## Environment Variables

### Required
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key for address autocomplete

### Optional
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `NODE_ENV` - Environment (development/production)
- `PORT` - Application port (default: 3000)

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 5432, and 6379 are not in use
2. **Permission issues**: On Linux, you might need to run with `sudo`
3. **Database connection**: Wait for the database health check to pass before the app starts

### Reset Everything

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

### View Resource Usage

```bash
# Check container resource usage
docker stats

# Check disk usage
docker system df
```

## Production Considerations

1. **Security**: Change default database passwords
2. **SSL**: Configure SSL certificates for production
3. **Backup**: Set up automated database backups
4. **Monitoring**: Add monitoring and logging solutions
5. **Scaling**: Consider using Docker Swarm or Kubernetes for scaling

## Support

For issues related to Docker setup, check:
- Docker logs: `docker-compose logs`
- Container status: `docker-compose ps`
- Resource usage: `docker stats`
