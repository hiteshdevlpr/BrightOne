#!/bin/bash
# Run services migration and seed on the database. Idempotent; safe to run on every deploy.
# Run from repo root (e.g. /home/brightone/website). Requires: docker compose, db container.
# Usage: ./scripts/run-services-migration.sh

set -e

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.from-image.yml}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "=== Services DB migration (idempotent) ==="

# Ensure db is up
docker compose -f "$COMPOSE_FILE" up -d db
echo "Waiting for Postgres to be ready..."
for i in $(seq 1 30); do
  if docker compose -f "$COMPOSE_FILE" exec -T db pg_isready -U brightone -d brightone_db >/dev/null 2>&1; then
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "ERROR: Postgres did not become ready"
    exit 1
  fi
  sleep 2
done

# Run migration (tables, indexes, triggers)
echo "Running migrate-services.sql..."
docker compose -f "$COMPOSE_FILE" exec -T db psql -U brightone -d brightone_db < database/migrate-services.sql

# Run seed (ON CONFLICT DO NOTHING)
echo "Running seed-services.sql..."
docker compose -f "$COMPOSE_FILE" exec -T db psql -U brightone -d brightone_db < database/seed-services.sql

echo "Services migration and seed complete."
