#!/bin/bash
# Run on the droplet to diagnose why the app is down.
# Usage: ssh user@DROPLET_IP 'cd /home/brightone/website && bash scripts/diagnose-droplet.sh'
# Or from the server: cd /home/brightone/website && bash scripts/diagnose-droplet.sh
set -e

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.from-image.yml}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "=============================================="
echo "  Droplet app diagnostic - $(date -Iseconds)"
echo "  PWD: $REPO_ROOT"
echo "=============================================="

# 1. Docker containers
echo ""
echo "--- 1. Docker containers ---"
docker compose -f "$COMPOSE_FILE" ps -a 2>/dev/null || docker ps -a

# 2. Health endpoints (which app slot responds?)
echo ""
echo "--- 2. App health (localhost) ---"
for port in 3000 3001; do
  if curl -sf --connect-timeout 3 "http://127.0.0.1:${port}/api/health" >/dev/null 2>&1; then
    echo "  Port $port: OK"
  else
    echo "  Port $port: DOWN or no response"
  fi
done

# 3. Nginx
echo ""
echo "--- 3. Nginx ---"
if systemctl is-active --quiet nginx 2>/dev/null; then
  echo "  nginx: running"
else
  echo "  nginx: NOT RUNNING"
fi
if [ -f /etc/nginx/conf.d/brightone-app-upstream.conf ]; then
  echo "  upstream config:"
  cat /etc/nginx/conf.d/brightone-app-upstream.conf | sed 's/^/    /'
else
  echo "  upstream config: FILE NOT FOUND"
fi

# 4. Recent app logs (whichever app container exists)
echo ""
echo "--- 4. Recent app logs (last 40 lines) ---"
for c in website-app-blue website-app-green; do
  if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -q "^${c}$"; then
    echo "  Container: $c"
    docker logs "$c" --tail=40 2>&1 | sed 's/^/    /'
    echo ""
  fi
done

# 5. DB and Redis
echo ""
echo "--- 5. DB and Redis ---"
docker compose -f "$COMPOSE_FILE" ps db redis 2>/dev/null || true
if docker compose -f "$COMPOSE_FILE" exec -T db pg_isready -U brightone -d brightone_db 2>/dev/null; then
  echo "  Postgres: reachable"
else
  echo "  Postgres: not reachable (container may be down)"
fi

# 6. Disk and memory
echo ""
echo "--- 6. Disk and memory ---"
df -h / /var/lib/docker 2>/dev/null | head -5
echo ""
free -h 2>/dev/null || true

# 7. .env
echo ""
echo "--- 7. Environment ---"
if [ -f .env ]; then
  echo "  .env: present ($(wc -c < .env) bytes)"
  echo "  (DATABASE_URL and other secrets are set)"
else
  echo "  .env: MISSING (app will not start correctly)"
fi

# 8. Suggested recovery
echo ""
echo "=============================================="
echo "  Suggested recovery"
echo "=============================================="
BLUE_OK=0
GREEN_OK=0
curl -sf --connect-timeout 2 http://127.0.0.1:3000/api/health >/dev/null 2>&1 && BLUE_OK=1
curl -sf --connect-timeout 2 http://127.0.0.1:3001/api/health >/dev/null 2>&1 && GREEN_OK=1

if [ "$BLUE_OK" -eq 1 ] || [ "$GREEN_OK" -eq 1 ]; then
  echo "At least one app slot is healthy. If the site is still down:"
  echo "  1. Check Nginx: sudo nginx -t && sudo systemctl status nginx"
  echo "  2. Ensure upstream points to the healthy port: cat /etc/nginx/conf.d/brightone-app-upstream.conf"
  echo "  3. If wrong port: sudo scripts/nginx-switch-upstream.sh 3000  (or 3001)"
  echo "  4. Reload: sudo systemctl reload nginx"
else
  echo "No app slot is healthy. Try:"
  echo "  1. Ensure db and redis are up:"
  echo "     docker compose -f $COMPOSE_FILE up -d db redis"
  echo "     sleep 10"
  echo "  2. Run blue-green deploy (starts one app slot and switches Nginx):"
  echo "     ./scripts/bluegreen-deploy.sh"
  echo "  3. If deploy fails, inspect: docker compose -f $COMPOSE_FILE logs app_blue"
  echo "  4. If .env was missing, add it and re-run step 2."
fi
echo ""
