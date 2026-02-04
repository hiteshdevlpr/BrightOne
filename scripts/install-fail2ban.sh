#!/bin/bash
# Install and configure fail2ban for SSH (and optionally nginx) on the droplet.
# Run as root on the server after bootstrap.
# Usage: ssh root@DROPLET_IP 'bash -s' < scripts/install-fail2ban.sh

set -e

echo "=== Installing fail2ban ==="
apt-get update -qq
apt-get install -y fail2ban

echo "=== Configuring fail2ban for SSH ==="
# Jail: ban after 5 failures in 10 minutes; ban for 1 hour
mkdir -p /etc/fail2ban/jail.d
cat > /etc/fail2ban/jail.d/sshd.local << 'JAIL'
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 5
findtime = 600
bantime = 3600
JAIL

echo "=== Enabling and starting fail2ban ==="
systemctl enable fail2ban
systemctl restart fail2ban

echo "=== Checking fail2ban status ==="
fail2ban-client status sshd 2>/dev/null || fail2ban-client status

echo ""
echo "✅ fail2ban is running. SSH brute-force will be banned after 5 failures in 10 minutes for 1 hour."
