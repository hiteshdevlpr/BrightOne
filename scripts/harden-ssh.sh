#!/bin/bash
# Harden SSH: key-only auth, no password; restrict root to key-based.
# Run as root on the server. Ensure you have key-based access working before running, or you may lock yourself out.
# Usage: ssh root@DROPLET_IP 'bash -s' < scripts/harden-ssh.sh

set -e

DROPIN="/etc/ssh/sshd_config.d/99-brightone-hardening.conf"

echo "=== Creating SSH hardening drop-in: $DROPIN ==="
mkdir -p "$(dirname "$DROPIN")"
cat > "$DROPIN" << 'EOF'
# BrightOne SSH hardening: key-only auth
PasswordAuthentication no
PermitRootLogin prohibit-password
PubkeyAuthentication yes
EOF

echo "=== Testing sshd config ==="
sshd -t

echo "=== Restarting sshd ==="
systemctl restart sshd

echo ""
echo "✅ SSH hardened: password auth disabled, root key-only (prohibit-password)."
echo "   Ensure your SSH key is in ~/.ssh/authorized_keys before disconnecting."
