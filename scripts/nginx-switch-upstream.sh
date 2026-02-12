#!/bin/bash
# Switch Nginx upstream to the given app port (3000 or 3001). Run as root or via sudo.
# Usage: nginx-switch-upstream.sh <port> [--force]
# --force: skip checking that the port responds (use when app is starting).
set -e
PORT="${1:-3000}"
FORCE=""
[ "$2" = "--force" ] && FORCE=1
if [ "$PORT" != "3000" ] && [ "$PORT" != "3001" ]; then
  echo "Usage: $0 3000|3001 [--force]" >&2
  exit 1
fi
if [ -z "$FORCE" ]; then
  if ! curl -sf --connect-timeout 2 "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
    echo "WARNING: Port $PORT did not respond to /api/health. Use --force to switch anyway." >&2
    exit 1
  fi
fi
CONF="/etc/nginx/conf.d/brightone-app-upstream.conf"
echo "upstream app_backend { server 127.0.0.1:${PORT}; }" > "$CONF"
nginx -t && systemctl reload nginx
echo "Nginx upstream switched to 127.0.0.1:${PORT}"
