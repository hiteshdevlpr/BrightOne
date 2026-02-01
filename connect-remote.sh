#!/bin/bash
# Connect to the BrightOne remote server (DigitalOcean droplet).
# Usage: ./connect-remote.sh
# For a new droplet: DROPLET_IP=new_ip ./connect-remote.sh
# Optional: DROPLET_USER=brightone (default: root)

DROPLET_IP="${DROPLET_IP:-159.203.26.50}"
DROPLET_USER="${DROPLET_USER:-root}"

echo "Connecting to $DROPLET_USER@$DROPLET_IP ..."
exec ssh "${DROPLET_USER}@${DROPLET_IP}" "$@"
