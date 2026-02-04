#!/bin/bash
# Backup server nginx logs and Docker container logs to local workspace.
# Usage: ./scripts/backup-server-logs.sh
# Requires: connect-remote.sh (and SSH access to droplet).

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

DROPLET_IP="${DROPLET_IP:-159.203.26.50}"
DROPLET_USER="${DROPLET_USER:-root}"
BACKUP_DIR="backups/server-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Backup directory: $BACKUP_DIR"

# Nginx logs (ssh stdout only; connection message may go to stderr with some SSH configs)
echo "Fetching nginx access.log..."
ssh "${DROPLET_USER}@${DROPLET_IP}" 'cat /var/log/nginx/access.log 2>/dev/null' > "$BACKUP_DIR/nginx-access.log" 2>/dev/null || true
echo "Fetching nginx error.log..."
ssh "${DROPLET_USER}@${DROPLET_IP}" 'cat /var/log/nginx/error.log 2>/dev/null' > "$BACKUP_DIR/nginx-error.log" 2>/dev/null || true

# Container logs (limit tail and use timeout so command returns)
echo "Fetching container logs (last 2000 lines, timeout 15s)..."
ssh "${DROPLET_USER}@${DROPLET_IP}" 'timeout 15 sh -c "cd /home/brightone/website && docker-compose -f docker-compose.prod.from-image.yml logs --no-color --tail=2000 2>&1"' > "$BACKUP_DIR/container-logs.txt" 2>/dev/null || true

# Container list (quick)
echo "Fetching docker ps -a..."
ssh "${DROPLET_USER}@${DROPLET_IP}" 'docker ps -a 2>&1' > "$BACKUP_DIR/docker-ps-a.txt" 2>/dev/null || true

# Manifest
cat > "$BACKUP_DIR/manifest.txt" << EOF
Server backup
Date: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
Host: ${DROPLET_USER}@${DROPLET_IP}

Contents:
- nginx-access.log   ($(wc -l < "$BACKUP_DIR/nginx-access.log" 2>/dev/null || echo 0) lines)
- nginx-error.log    ($(wc -l < "$BACKUP_DIR/nginx-error.log" 2>/dev/null || echo 0) lines)
- container-logs.txt ($(wc -l < "$BACKUP_DIR/container-logs.txt" 2>/dev/null || echo 0) lines)
- docker-ps-a.txt   (container list)
EOF

echo "Done. Backup in $BACKUP_DIR"
