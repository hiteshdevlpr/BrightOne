#!/bin/bash
# Erase all app contents on the droplet and bootstrap for BrightOne deploy.
# Run on the droplet as root (e.g. via: ssh root@DROPLET_IP 'bash -s' < scripts/erase-and-bootstrap-droplet.sh)

set -e

echo "=== ERASE: Stopping and removing all Docker containers and volumes ==="
if [ -f /home/brightone/website/docker-compose.prod.yml ]; then
  cd /home/brightone/website && docker compose -f docker-compose.prod.yml down -v 2>/dev/null || true
fi
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm -f $(docker ps -aq) 2>/dev/null || true
docker volume rm $(docker volume ls -q) 2>/dev/null || true
docker system prune -af --volumes 2>/dev/null || true
echo "Done."

echo ""
echo "=== ERASE: Removing brightone user and home ==="
pkill -u brightone 2>/dev/null || true
sleep 1
userdel -rf brightone 2>/dev/null || true
rm -rf /home/brightone
echo "Done."

echo ""
echo "=== BOOTSTRAP: Creating user brightone ==="
adduser --disabled-password --gecos '' brightone
mkdir -p /home/brightone/.ssh
chown brightone:brightone /home/brightone/.ssh
chmod 700 /home/brightone/.ssh

# Deploy key (public key for GitHub Actions - matches ~/.ssh/github_actions_deploy.pub)
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINjc4/pH7n5KkeOLWlZhB8WuSo2YUFhHihXJlgIBFAYH github-actions-deploy@github.com' > /home/brightone/.ssh/authorized_keys
chown brightone:brightone /home/brightone/.ssh/authorized_keys
chmod 600 /home/brightone/.ssh/authorized_keys

echo ""
echo "=== BOOTSTRAP: Creating website dir and docker group ==="
mkdir -p /home/brightone/website
chown -R brightone:brightone /home/brightone/website
getent group docker >/dev/null && usermod -aG docker brightone || true

echo ""
echo "=== BOOTSTRAP: Verifying ==="
id brightone
ls -la /home/brightone/
cat /home/brightone/.ssh/authorized_keys

echo ""
echo "✅ Erase and bootstrap complete. Push to main to deploy via GitHub Actions."
