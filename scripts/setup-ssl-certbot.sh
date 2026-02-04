#!/bin/bash
# Obtain and install SSL certificate with certbot (nginx). Nginx must already be installed and serving the domain.
# Run as root on the server. Ensure DNS for brightone.ca and www.brightone.ca points to this server.
# Usage: ssh root@DROPLET_IP 'bash -s' < scripts/setup-ssl-certbot.sh
# Or with custom domains: DOMAINS="brightone.ca www.brightone.ca" bash -s < scripts/setup-ssl-certbot.sh

set -e

DOMAINS="${DOMAINS:-brightone.ca www.brightone.ca}"

echo "=== Checking certbot ==="
if ! command -v certbot &>/dev/null; then
  echo "Installing certbot..."
  apt-get update -qq
  apt-get install -y certbot python3-certbot-nginx
fi

CERT_ARGS=""
for d in $DOMAINS; do CERT_ARGS="$CERT_ARGS -d $d"; done
echo "=== Obtaining certificate for: $DOMAINS ==="
certbot --nginx $CERT_ARGS --non-interactive --agree-tos --register-unsafely-without-email || true

echo "=== Reloading nginx ==="
nginx -t && systemctl reload nginx

echo "=== Checking 443 ==="
ss -tlnp | grep ':443 ' || echo "Port 443 not yet listening (check nginx config and cert paths)."

echo ""
echo "✅ Certbot run complete. Test HTTPS: https://brightone.ca"
echo "Renewal: certbot renew (often via cron or systemd timer)."
