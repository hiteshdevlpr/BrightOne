#!/bin/bash
# Blue-green deploy: start inactive app slot, wait for health, switch Nginx, stop old slot.
# Run from repo root (e.g. /home/brightone/website). Requires: docker compose, curl, sudo for nginx switch.
# Usage: ./scripts/bluegreen-deploy.sh
set -e

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.from-image.yml}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "=== Blue-green deploy (compose: $COMPOSE_FILE) ==="

# Optional: stop legacy single "app" container from previous compose (no longer in this file)
docker stop website-app-1 2>/dev/null || true
docker rm website-app-1 2>/dev/null || true

# Ensure DB and Redis are up (no-op if already running). App start will wait for db health via depends_on.
echo "Ensuring db and redis are up..."
docker compose -f "$COMPOSE_FILE" up -d db redis
sleep 5

# Which slot is currently serving traffic? (Nginx points to one of them)
BLUE_UP=0
GREEN_UP=0
curl -sf --connect-timeout 2 http://127.0.0.1:3000/api/health >/dev/null 2>&1 && BLUE_UP=1
curl -sf --connect-timeout 2 http://127.0.0.1:3001/api/health >/dev/null 2>&1 && GREEN_UP=1

if [ "$BLUE_UP" -eq 1 ] && [ "$GREEN_UP" -eq 0 ]; then
  ACTIVE="blue"
  TARGET="green"
  NEW_PORT=3001
elif [ "$GREEN_UP" -eq 1 ] && [ "$BLUE_UP" -eq 0 ]; then
  ACTIVE="green"
  TARGET="blue"
  NEW_PORT=3000
else
  # Neither up (first deploy or both down): deploy to blue
  ACTIVE="none"
  TARGET="blue"
  NEW_PORT=3000
fi

echo "Active slot: $ACTIVE → deploying to $TARGET (port $NEW_PORT)"

# Start the target app slot (pulls latest image from compose, recreates if image changed)
echo "Starting app_$TARGET..."
docker compose -f "$COMPOSE_FILE" up -d "app_$TARGET"

# Wait for new slot to be healthy (Next.js can take 60s+ on first start; allow up to ~3 min)
echo "Waiting for app_$TARGET to be healthy on port $NEW_PORT..."
HEALTHY=0
for i in $(seq 1 20); do
  if curl -sf --connect-timeout 5 "http://127.0.0.1:${NEW_PORT}/api/health" >/dev/null 2>&1; then
    echo "app_$TARGET is healthy (attempt $i)."
    HEALTHY=1
    break
  fi
  if [ "$i" -eq 20 ]; then
    echo "ERROR: app_$TARGET failed to become healthy on port $NEW_PORT after 20 attempts"
    docker compose -f "$COMPOSE_FILE" logs --tail=80 "app_$TARGET"
    # If both slots were down, switch nginx to new port anyway so when container eventually responds, traffic can flow
    if [ "$ACTIVE" = "none" ]; then
      echo "Switching Nginx to $NEW_PORT anyway (no previous active slot)..."
      sudo "$SCRIPT_DIR/nginx-switch-upstream.sh" "$NEW_PORT" --force || true
    fi
    exit 1
  fi
  sleep 10
done

# Switch Nginx to new port (requires sudo for nginx-switch-upstream.sh)
echo "Switching Nginx upstream to port $NEW_PORT..."
sudo "$SCRIPT_DIR/nginx-switch-upstream.sh" "$NEW_PORT"

# Verify new port still responds after switch (avoids pointing nginx at a slot that died during switch)
echo "Verifying app_$TARGET still responding after Nginx switch..."
for v in 1 2 3; do
  if curl -sf --connect-timeout 5 "http://127.0.0.1:${NEW_PORT}/api/health" >/dev/null 2>&1; then
    break
  fi
  if [ "$v" -eq 3 ]; then
    echo "ERROR: app_$TARGET stopped responding after Nginx switch. Reverting Nginx to previous port $([ "$ACTIVE" = "none" ] && echo "3000" || echo "$([ "$ACTIVE" = "blue" ] && echo "3000" || echo "3001")")..."
    [ "$ACTIVE" = "blue" ] && sudo "$SCRIPT_DIR/nginx-switch-upstream.sh" 3000 || true
    [ "$ACTIVE" = "green" ] && sudo "$SCRIPT_DIR/nginx-switch-upstream.sh" 3001 || true
    [ "$ACTIVE" = "none" ] && sudo "$SCRIPT_DIR/nginx-switch-upstream.sh" 3000 || true
    exit 1
  fi
  sleep 5
done

# Stop the old slot (so only one app container runs until next deploy)
if [ "$ACTIVE" != "none" ]; then
  echo "Stopping app_$ACTIVE..."
  docker compose -f "$COMPOSE_FILE" stop "app_$ACTIVE"
fi

echo "Blue-green deploy complete. Traffic now on app_$TARGET (port $NEW_PORT)."
