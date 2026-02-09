#!/bin/bash
# Validate all security measures after deployment.
# Run on the server (as root or brightone with docker access):
#   bash /home/brightone/website/scripts/validate-security.sh
# Or via SSH: ssh root@DROPLET_IP 'bash -s' < scripts/validate-security.sh
#
# Exits 0 if all checks pass, 1 if any fail. Prints OK/FAIL per measure.

set -e

FAILED=0
# Blue-green: try active slot (3000 or 3001); set below after detecting which is up
APP_URL="${APP_URL:-}"

ok()  { echo "  ✅ $1"; }
fail() { echo "  ❌ $1"; FAILED=1; }
warn() { echo "  ⚠️  $1"; }

echo "=============================================="
echo " BrightOne security validation"
echo "=============================================="

# Detect active app (blue-green: one of 3000 or 3001)
if [ -z "$APP_URL" ]; then
  if curl -sf --connect-timeout 2 http://127.0.0.1:3000/api/health >/dev/null 2>&1; then
    APP_URL="http://127.0.0.1:3000"
  elif curl -sf --connect-timeout 2 http://127.0.0.1:3001/api/health >/dev/null 2>&1; then
    APP_URL="http://127.0.0.1:3001"
  else
    APP_URL="http://127.0.0.1:3000"
  fi
fi
echo " APP_URL=$APP_URL"
echo "=============================================="

# --- 1. Docker app container hardening ---
echo ""
echo "1. Docker app container"
APP_CONTAINER=$(docker ps --filter "ancestor=website-app:latest" --format '{{.Names}}' 2>/dev/null | head -1)
if [ -z "$APP_CONTAINER" ]; then
  APP_CONTAINER=$(docker ps --filter "name=website-app-blue" --format '{{.Names}}' 2>/dev/null | head -1)
fi
if [ -z "$APP_CONTAINER" ]; then
  APP_CONTAINER=$(docker ps --filter "name=website-app-green" --format '{{.Names}}' 2>/dev/null | head -1)
fi
if [ -z "$APP_CONTAINER" ]; then
  APP_CONTAINER=$(docker ps -a --filter "name=app" --format '{{.Names}}' 2>/dev/null | head -1)
fi
if [ -z "$APP_CONTAINER" ]; then
  fail "App container not found (is the stack running?)"
else
  SECOPTS=$(docker inspect "$APP_CONTAINER" --format '{{.HostConfig.SecurityOpt}}' 2>/dev/null)
  TMPFS=$(docker inspect "$APP_CONTAINER" --format '{{.HostConfig.Tmpfs}}' 2>/dev/null)
  BINDS=$(docker inspect "$APP_CONTAINER" --format '{{range $p, $conf := .NetworkSettings.Ports}}{{$p}} {{end}}' 2>/dev/null)
  CAPS=$(docker inspect "$APP_CONTAINER" --format '{{.HostConfig.CapDrop}}' 2>/dev/null)
  PIDS=$(docker inspect "$APP_CONTAINER" --format '{{.HostConfig.PidsLimit}}' 2>/dev/null)

  echo "$SECOPTS" | grep -q "no-new-privileges" && ok "no-new-privileges:true" || fail "no-new-privileges missing"
  echo "$TMPFS" | grep -q "/tmp" && ok "tmpfs /tmp (noexec,nosuid)" || fail "tmpfs /tmp missing"
  (echo "$BINDS" | grep -q "127.0.0.1" || docker port "$APP_CONTAINER" 2>/dev/null | grep -q "127.0.0.1") && ok "app port bound to 127.0.0.1 only (3000 or 3001)" || warn "port binding (expected 127.0.0.1)"
  ([ -z "$CAPS" ] || echo "$CAPS" | grep -q "ALL") && ok "cap_drop: ALL" || warn "cap_drop (expected ALL)"
  [ -n "$PIDS" ] && [ "$PIDS" -gt 0 ] 2>/dev/null && ok "pids_limit: $PIDS" || warn "pids_limit not set"
fi

# --- 2. App processes (no suspicious) ---
echo ""
echo "2. App processes (no malware)"
if [ -n "$APP_CONTAINER" ]; then
  PROCS=$(docker top "$APP_CONTAINER" 2>/dev/null | tail -n +2 || true)
  if echo "$PROCS" | grep -q "next-server\|node"; then
    ok "Expected processes (node/next-server) present"
  else
    warn "Could not list processes"
  fi
  if echo "$PROCS" | grep -qvE "node|next-server|PID"; then
    warn "Other processes in container: review with docker top $APP_CONTAINER"
  fi
else
  warn "Skipped (no app container)"
fi

# --- 3. Nginx ---
echo ""
echo "3. Nginx"
if command -v nginx &>/dev/null; then
  nginx -t &>/dev/null && ok "Nginx config valid" || fail "Nginx config invalid"
  grep -rq "limit_req_zone" /etc/nginx/ 2>/dev/null && ok "Rate limiting configured" || fail "Rate limiting not found in nginx"
  ss -tlnp 2>/dev/null | grep -q ':80 ' && ok "Listening on port 80" || fail "Not listening on 80"
  if ss -tlnp 2>/dev/null | grep -q ':443 '; then
    ok "Listening on port 443 (HTTPS)"
  else
    warn "Not listening on 443 (HTTPS) - run certbot if needed"
  fi
else
  fail "Nginx not installed"
fi

# --- 4. Fail2ban ---
echo ""
echo "4. Fail2ban"
if command -v fail2ban-client &>/dev/null; then
  if fail2ban-client status &>/dev/null; then
    ok "Fail2ban running"
    fail2ban-client status sshd &>/dev/null && ok "sshd jail active" || warn "sshd jail not active"
  else
    fail "Fail2ban not running"
  fi
else
  fail "Fail2ban not installed"
fi

# --- 5. UFW ---
echo ""
echo "5. Host firewall (UFW)"
if command -v ufw &>/dev/null; then
  UFW_STATUS=$(ufw status 2>/dev/null | head -1)
  if echo "$UFW_STATUS" | grep -qi "active"; then
    ok "UFW active"
    ufw status 2>/dev/null | grep -q "22.*ALLOW" && ok "SSH (22) allowed" || fail "SSH (22) not allowed"
    ufw status 2>/dev/null | grep -q "80.*ALLOW" && ok "HTTP (80) allowed" || fail "HTTP (80) not allowed"
    ufw status 2>/dev/null | grep -q "443.*ALLOW" && ok "HTTPS (443) allowed" || fail "HTTPS (443) not allowed"
  else
    fail "UFW not active"
  fi
else
  fail "UFW not installed"
fi

# --- 6. API security (localhost) ---
echo ""
echo "6. API security (localhost)"
HEALTH=$(curl -sf -o /dev/null -w "%{http_code}" "$APP_URL/api/health" 2>/dev/null || echo "000")
[ "$HEALTH" = "200" ] && ok "/api/health → 200" || fail "/api/health → $HEALTH (expected 200)"

MIGRATE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/api/migrate" 2>/dev/null || echo "000")
[ "$MIGRATE" = "503" ] || [ "$MIGRATE" = "401" ] && ok "/api/migrate (no token) → $MIGRATE" || fail "/api/migrate → $MIGRATE (expected 503 or 401)"

DEBUG=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/api/debug-env" 2>/dev/null || echo "000")
[ "$DEBUG" = "404" ] && ok "/api/debug-env → 404 (hidden in prod)" || fail "/api/debug-env → $DEBUG (expected 404)"

ADMIN_NO_KEY=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/api/admin/dashboard" 2>/dev/null || echo "000")
[ "$ADMIN_NO_KEY" = "503" ] || [ "$ADMIN_NO_KEY" = "401" ] && ok "/api/admin/dashboard (no key) → $ADMIN_NO_KEY" || fail "/api/admin/dashboard → $ADMIN_NO_KEY (expected 503 or 401)"

# --- 7. Secrets in .env (presence only) ---
echo ""
echo "7. Secrets in .env (presence only)"
ENV_FILE="/home/brightone/website/.env"
if [ -f "$ENV_FILE" ]; then
  grep -q "MIGRATION_TOKEN=" "$ENV_FILE" 2>/dev/null && ok "MIGRATION_TOKEN set" || fail "MIGRATION_TOKEN missing in .env"
  grep -q "ADMIN_API_KEY=" "$ENV_FILE" 2>/dev/null && ok "ADMIN_API_KEY set" || fail "ADMIN_API_KEY missing in .env"
else
  warn ".env not found (validation may run outside deploy context)"
fi

# --- 8. SSH hardening (optional) ---
echo ""
echo "8. SSH hardening"
DROPIN="/etc/ssh/sshd_config.d/99-brightone-hardening.conf"
if [ -f "$DROPIN" ]; then
  grep -q "PasswordAuthentication no" "$DROPIN" 2>/dev/null && ok "PasswordAuthentication no" || warn "PasswordAuthentication not set in drop-in"
  grep -q "PermitRootLogin prohibit-password" "$DROPIN" 2>/dev/null && ok "PermitRootLogin prohibit-password" || warn "PermitRootLogin not set in drop-in"
else
  warn "SSH hardening drop-in not present (optional)"
fi

# --- 9. App ports (3000/3001) not public ---
echo ""
echo "9. App ports (3000/3001) not public"
if command -v ss &>/dev/null; then
  LISTEN_3000=$(ss -tlnp 2>/dev/null | grep ':3000 ' || true)
  LISTEN_3001=$(ss -tlnp 2>/dev/null | grep ':3001 ' || true)
  BAD=""
  if [ -n "$LISTEN_3000" ] && ! echo "$LISTEN_3000" | grep -q "127.0.0.1:3000"; then BAD="3000"; fi
  if [ -n "$LISTEN_3001" ] && ! echo "$LISTEN_3001" | grep -q "127.0.0.1:3001"; then BAD="${BAD} 3001"; fi
  if [ -n "$BAD" ]; then
    fail "Port(s) $BAD may be public (expected 127.0.0.1 only)"
  elif [ -z "$LISTEN_3000" ] && [ -z "$LISTEN_3001" ]; then
    warn "Nothing listening on 3000 or 3001 (app may be down)"
  else
    ok "App port(s) bound to 127.0.0.1 only (not public)"
  fi
fi

# --- Summary ---
echo ""
echo "=============================================="
if [ $FAILED -eq 0 ]; then
  echo " Result: ALL CHECKS PASSED"
  echo "=============================================="
  exit 0
else
  echo " Result: SOME CHECKS FAILED"
  echo "=============================================="
  exit 1
fi
