#!/bin/bash

# Script to fix production deployment issues on the droplet
# This script applies the network and Dockerfile fixes directly on the server

set -e

echo "🔧 Fixing production deployment issues..."

# Navigate to website directory
cd /home/brightone/website || {
    echo "❌ Directory /home/brightone/website not found!"
    exit 1
}

echo "📝 Backing up current files..."
cp docker-compose.prod.yml docker-compose.prod.yml.backup
cp Dockerfile Dockerfile.backup

echo "🔧 Fixing docker-compose.prod.yml..."

# Create the fixed docker-compose.prod.yml
cat > docker-compose.prod.yml << 'EOF'
services:
  # Next.js Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - REDIS_URL=redis://redis:6379
      - AWS_REGION=${AWS_REGION}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - FROM_EMAIL=${FROM_EMAIL}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - brightone-network
    restart: unless-stopped

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=brightone_db
      - POSTGRES_USER=brightone
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "127.0.0.1:5432:5432"
    networks:
      - brightone-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U brightone -d brightone_db"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s
    restart: unless-stopped

  # Redis
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - brightone-network
    restart: unless-stopped
    command: redis-server --appendonly yes

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  brightone-network:
    driver: bridge
EOF

echo "🔧 Fixing Dockerfile..."

# Read the current Dockerfile and fix the npm ci line
sed -i 's/RUN npm ci --only=production/RUN npm ci/' Dockerfile

echo "✅ Files updated successfully!"

echo "🛑 Stopping existing containers..."
sudo docker-compose -f docker-compose.prod.yml down || true

echo "🧹 Cleaning up old images..."
sudo docker system prune -f || true

echo "🏗️ Building services with fixes..."
sudo docker-compose -f docker-compose.prod.yml build --no-cache

echo "🚀 Starting services..."
sudo docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "📊 Checking service status..."
sudo docker-compose -f docker-compose.prod.yml ps

echo "📋 Application logs:"
sudo docker-compose -f docker-compose.prod.yml logs app --tail=50

echo ""
echo "✅ Deployment fix completed!"
echo "🔍 Check the logs above to verify the application is running correctly."
echo "💡 If there are issues, check logs with: sudo docker-compose -f docker-compose.prod.yml logs -f app"
