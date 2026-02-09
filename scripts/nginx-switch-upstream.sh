#!/bin/bash
# Switch Nginx upstream to the given app port (3000 or 3001). Run as root or via sudo.
# Usage: nginx-switch-upstream.sh <port>
set -e
PORT="${1:-3000}"
if [ "$PORT" != "3000" ] && [ "$PORT" != "3001" ]; then
  echo "Usage: $0 3000|3001" >&2
  exit 1
fi
CONF="/etc/nginx/conf.d/brightone-app-upstream.conf"
echo "upstream app_backend { server 127.0.0.1:${PORT}; }" > "$CONF"
nginx -t && systemctl reload nginx
echo "Nginx upstream switched to 127.0.0.1:${PORT}"
