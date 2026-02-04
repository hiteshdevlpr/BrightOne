#!/bin/bash
# Bootstrap a **new** droplet for BrightOne deploy (no erase).
# Run as root on the new droplet after you create it.
# Usage: ssh root@NEW_DROPLET_IP 'bash -s' < scripts/bootstrap-new-droplet.sh
# Or copy this script to the server and run: sudo bash bootstrap-new-droplet.sh

set -e

echo "=== Installing Docker (if not present) ==="
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm -f get-docker.sh
else
  echo "Docker already installed."
fi

echo ""
echo "=== Installing Docker Compose (if not present) ==="
if ! command -v docker-compose &>/dev/null; then
  curl -fsSL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
else
  echo "Docker Compose already installed."
fi

echo ""
echo "=== Creating user brightone ==="
id brightone &>/dev/null || adduser --disabled-password --gecos '' brightone
mkdir -p /home/brightone/.ssh
chown brightone:brightone /home/brightone/.ssh
chmod 700 /home/brightone/.ssh

# Deploy key (public key for GitHub Actions - matches ~/.ssh/github_actions_deploy.pub)
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINjc4/pH7n5KkeOLWlZhB8WuSo2YUFhHihXJlgIBFAYH github-actions-deploy@github.com' > /home/brightone/.ssh/authorized_keys
chown brightone:brightone /home/brightone/.ssh/authorized_keys
chmod 600 /home/brightone/.ssh/authorized_keys

echo ""
echo "=== Creating website dir and docker group ==="
mkdir -p /home/brightone/website
chown -R brightone:brightone /home/brightone/website
getent group docker >/dev/null && usermod -aG docker brightone || true

# Allow brightone to run the consolidated setup script as root (for CI/CD, no manual SSH as root).
SETUP_SCRIPT="/home/brightone/website/scripts/setup-server-full.sh"
echo "brightone ALL=(ALL) NOPASSWD: $SETUP_SCRIPT" > /etc/sudoers.d/brightone-setup
chmod 440 /etc/sudoers.d/brightone-setup

echo ""
echo "=== Verifying ==="
docker --version
docker-compose --version
id brightone
ls -la /home/brightone/
cat /home/brightone/.ssh/authorized_keys

echo ""
echo "✅ Bootstrap complete."
echo "Next:"
echo "  1. Update GitHub Secret DROPLET_IP to this droplet's IP, then push to main to deploy."
echo "  2. (Optional) Server security (Nginx, SSL, Fail2ban, UFW) runs automatically in CI via scripts/setup-server-full.sh."
echo "  3. Set MIGRATION_TOKEN and ADMIN_API_KEY in GitHub Secrets so /api/migrate and admin APIs are protected."
