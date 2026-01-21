#!/bin/bash

# Script to apply production fixes directly to the droplet
# Usage: ./apply-fixes-to-droplet.sh [DROPLET_IP] [USERNAME]

set -e

DROPLET_IP="${1:-$DROPLET_IP}"
USERNAME="${2:-brightone}"

if [ -z "$DROPLET_IP" ]; then
    echo "❌ Error: Droplet IP not provided"
    echo "Usage: $0 <DROPLET_IP> [USERNAME]"
    echo "   or set DROPLET_IP environment variable"
    exit 1
fi

echo "🚀 Applying fixes to droplet $DROPLET_IP as user $USERNAME..."

# Copy the fix script to the server
echo "📤 Copying fix script to server..."
scp fix-production-deployment.sh ${USERNAME}@${DROPLET_IP}:/tmp/fix-production-deployment.sh

# Run the fix script on the server
echo "🔧 Running fix script on server..."
ssh ${USERNAME}@${DROPLET_IP} << 'ENDSSH'
chmod +x /tmp/fix-production-deployment.sh
sudo bash /tmp/fix-production-deployment.sh
ENDSSH

echo "✅ Fixes applied successfully!"
echo "🔍 Check the output above for any issues."
