#!/bin/bash
# Run payment fields migration on the bookings table. Idempotent; safe to run.
# Usage: ./scripts/run-payment-migration.sh

set -e

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.from-image.yml}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "=== Payment Fields Migration ==="

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

# Run migration
echo "Running migrate-core-tables.sql..."
docker compose -f "$COMPOSE_FILE" exec -T db psql -U brightone -d brightone_db < database/migrate-core-tables.sql

echo "Running migrate-payment-fields.sql..."
docker compose -f "$COMPOSE_FILE" exec -T db psql -U brightone -d brightone_db < database/migrate-payment-fields.sql

echo "Payment fields migration complete."
