#!/bin/bash
# Consolidated server setup: Nginx (with rate limiting), SSL via Certbot, Fail2ban, UFW, optional SSH hardening.
# Run as root (or via sudo from user brightone). Safe to run on every deploy (idempotent).
#
# Usage (on server as root):
#   bash /home/brightone/website/scripts/setup-server-full.sh
# Or from CI (as brightone with sudo):
#   sudo DOMAINS="brightone.ca www.brightone.ca" /home/brightone/website/scripts/setup-server-full.sh
#
# Env or args (all optional):
#   DOMAINS          - Space-separated domains for nginx and certbot (default: brightone.ca www.brightone.ca)
#   SKIP_SSL=1       - Skip certbot (e.g. if DNS not ready or no TLS yet)
#   SKIP_SSH_HARDEN=1 - Skip SSH hardening (recommended in CI; enable only after key-based access is verified)
# Args: $1=DOMAINS $2=SKIP_SSL $3=SKIP_SSH_HARDEN (so CI can pass without relying on sudo env)

set -e

DOMAINS="${1:-${DOMAINS:-brightone.ca www.brightone.ca}}"
SKIP_SSL="${2:-${SKIP_SSL:-0}}"
SKIP_SSH_HARDEN="${3:-${SKIP_SSH_HARDEN:-0}}"
# For nginx server_name directive (single line)
SERVER_NAMES="$DOMAINS"

echo "=== Consolidated server setup (Nginx, SSL, Fail2ban, UFW, optional SSH) ==="
echo "DOMAINS=$DOMAINS SKIP_SSL=${SKIP_SSL:-0} SKIP_SSH_HARDEN=${SKIP_SSH_HARDEN:-0}"

# --- Nginx ---
echo ""
echo "=== Installing Nginx ==="
apt-get update -qq
apt-get install -y nginx

echo "=== Installing Certbot (for SSL) ==="
apt-get install -y certbot python3-certbot-nginx

echo "=== Creating Nginx config (HTTP; Certbot will add SSL if run) ==="
mkdir -p /etc/nginx/conf.d
cat > /etc/nginx/conf.d/rate-limit.conf << 'RATELIMIT'
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=2r/s;
RATELIMIT

cat > /etc/nginx/sites-available/brightone << NGINX_HTTP
server {
    listen 80;
    server_name $SERVER_NAMES;
    limit_req zone=general burst=20 nodelay;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    location /api/ {
        limit_req zone=api burst=5 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX_HTTP

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/brightone /etc/nginx/sites-enabled/brightone

echo "=== Testing Nginx config ==="
nginx -t

echo "=== Enabling and starting Nginx ==="
systemctl enable nginx
systemctl reload nginx 2>/dev/null || systemctl start nginx

# --- SSL (Certbot) ---
if [ "${SKIP_SSL}" != "1" ]; then
  echo ""
  echo "=== Obtaining SSL certificate (non-interactive) ==="
  CERT_ARGS=""
  for d in $DOMAINS; do CERT_ARGS="$CERT_ARGS -d $d"; done
  certbot --nginx $CERT_ARGS --non-interactive --agree-tos --register-unsafely-without-email --keep-until-expiring 2>/dev/null || true
  nginx -t && systemctl reload nginx 2>/dev/null || true
else
  echo ""
  echo "=== Skipping SSL (SKIP_SSL=1) ==="
fi

# --- Fail2ban ---
echo ""
echo "=== Installing and configuring Fail2ban (SSH jail) ==="
apt-get install -y fail2ban
mkdir -p /etc/fail2ban/jail.d
cat > /etc/fail2ban/jail.d/sshd.local << 'JAIL'
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 5
findtime = 600
bantime = 3600
JAIL
systemctl enable fail2ban
systemctl restart fail2ban 2>/dev/null || systemctl start fail2ban

# --- UFW ---
echo ""
echo "=== Enabling UFW (allow 22, 80, 443; default deny) ==="
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# --- Optional: SSH hardening ---
if [ "${SKIP_SSH_HARDEN}" != "1" ]; then
  echo ""
  echo "=== Applying SSH hardening (key-only, root prohibit-password) ==="
  DROPIN="/etc/ssh/sshd_config.d/99-brightone-hardening.conf"
  mkdir -p "$(dirname "$DROPIN")"
  cat > "$DROPIN" << 'EOF'
# BrightOne SSH hardening: key-only auth
PasswordAuthentication no
PermitRootLogin prohibit-password
PubkeyAuthentication yes
EOF
  sshd -t && systemctl restart sshd
else
  echo ""
  echo "=== Skipping SSH hardening (SKIP_SSH_HARDEN=1) ==="
fi

echo ""
echo "=== Setup summary ==="
ss -tlnp | grep -E ':80 |:443 ' || true
ufw status | head -5
fail2ban-client status sshd 2>/dev/null || true
echo ""
echo "✅ Consolidated server setup complete."
