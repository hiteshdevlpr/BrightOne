#!/bin/bash
# Install Nginx on the droplet and proxy HTTP to the app (port 3000).
# Run as root on the droplet. After this, run certbot for SSL.
# Usage: ssh root@159.203.26.50 'bash -s' < scripts/setup-nginx-on-droplet.sh

set -e

echo "=== Installing Nginx ==="
apt-get update -qq
apt-get install -y nginx

echo "=== Installing Certbot (for SSL) ==="
apt-get install -y certbot python3-certbot-nginx

echo "=== Creating Nginx config (HTTP only; Certbot will add SSL) ==="
# Rate limiting: 10 req/s per IP for general; 2 req/s for API (burst 5)
mkdir -p /etc/nginx/conf.d
cat > /etc/nginx/conf.d/rate-limit.conf << 'RATELIMIT'
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=2r/s;
RATELIMIT

cat > /etc/nginx/sites-available/brightone << 'NGINX_HTTP'
server {
    listen 80;
    server_name brightone.ca www.brightone.ca;
    limit_req zone=general burst=20 nodelay;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    location /api/ {
        limit_req zone=api burst=5 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_HTTP

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/brightone /etc/nginx/sites-enabled/brightone

echo "=== Testing Nginx config ==="
nginx -t

echo "=== Enabling and starting Nginx ==="
systemctl enable nginx
systemctl reload nginx || systemctl start nginx

echo "=== Checking port 80 ==="
ss -tlnp | grep ':80 ' || true

echo ""
echo "✅ Nginx is running. HTTP (port 80) should now work for brightone.ca"
echo "Next: get SSL with Certbot (run on the droplet):"
echo "  sudo certbot --nginx -d brightone.ca -d www.brightone.ca"
echo "Then HTTPS will work and Certbot will auto-renew."
