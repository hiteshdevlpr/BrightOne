#!/usr/bin/env bash
# Reset the Postgres data volume to fix I/O corruption (e.g. pg_filenode.map / 58030).
# Run from repo root after Docker is healthy: ./scripts/reset-db-volume.sh
#
# WARNING: Deletes all DB data (bookings, contacts, services, etc.). Re-run migrations after.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "Stopping db container..."
docker compose stop db

echo "Removing db container and postgres_data volume..."
docker rm -f brightone-creative-db-1 2>/dev/null || true
docker volume rm brightone-creative_postgres_data 2>/dev/null || true

echo "Starting fresh db (init.sql will run on first start)..."
docker compose up -d db

echo "Waiting for Postgres to be ready..."
for i in {1..30}; do
  if docker compose exec -T db pg_isready -U brightone -d brightone_db 2>/dev/null; then
    echo "Postgres is ready."
    echo "Run migrations if needed: curl -X POST http://localhost:3000/api/migrate"
    exit 0
  fi
  sleep 1
done

echo "Postgres may still be starting. Check: docker compose logs -f db"
exit 1
