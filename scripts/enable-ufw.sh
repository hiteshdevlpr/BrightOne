#!/bin/bash
# Enable UFW with safe defaults: allow SSH (22), HTTP (80), HTTPS (443); default deny incoming.
# Run as root on the server. Ensure SSH (22) is allowed before enabling or you may lock yourself out.
# Usage: ssh root@DROPLET_IP 'bash -s' < scripts/enable-ufw.sh

set -e

echo "=== Enabling UFW (allow 22, 80, 443; default deny) ==="
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
# Do not allow 3000 from outside; app is behind nginx and bound to 127.0.0.1

echo "=== Enabling UFW (will prompt to confirm) ==="
ufw --force enable

echo "=== Status ==="
ufw status verbose | head -30

echo ""
echo "✅ UFW enabled. Incoming: only 22, 80, 443 allowed."
