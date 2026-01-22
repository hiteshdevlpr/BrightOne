#!/bin/bash
# Fix Email Network Connectivity Issue
# This script diagnoses and attempts to fix network connectivity issues preventing AWS SES emails

set -e

echo "=========================================="
echo "Email Network Connectivity Fix Script"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_ping() {
    echo -n "Testing ping to 8.8.8.8... "
    if ping -c 2 -W 2 8.8.8.8 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

test_https() {
    echo -n "Testing HTTPS to google.com... "
    if timeout 5 curl -I https://www.google.com > /dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED (timeout)${NC}"
        return 1
    fi
}

test_aws_ses() {
    echo -n "Testing HTTPS to AWS SES... "
    if timeout 5 curl -I https://email.ca-central-1.amazonaws.com > /dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED (timeout)${NC}"
        return 1
    fi
}

# Run diagnostics
echo "=== Running Diagnostics ==="
test_ping
test_https
test_aws_ses
echo ""

# Check UFW
echo "=== Checking Firewall ==="
echo "UFW Status:"
ufw status | grep -E "Status|443|80" || true
echo ""

# Check iptables OUTPUT chain
echo "=== Checking iptables OUTPUT Chain ==="
iptables -L OUTPUT -n -v | head -5
echo ""

# Check if Digital Ocean Firewall might be blocking
echo "=== Network Configuration ==="
echo "Default Gateway:"
ip route | grep default
echo ""
echo "Network Interfaces:"
ip addr show | grep -E "^[0-9]+:|inet " | head -10
echo ""

# Attempt fixes
echo "=== Attempting Fixes ==="

# 1. Ensure UFW allows outbound HTTPS
echo "1. Ensuring UFW allows outbound HTTPS..."
ufw allow out 443/tcp > /dev/null 2>&1 || true
ufw allow out 80/tcp > /dev/null 2>&1 || true
echo -e "${GREEN}✓ UFW rules updated${NC}"

# 2. Check for proxy settings that might interfere
echo "2. Checking for proxy settings..."
if [ -n "$http_proxy" ] || [ -n "$https_proxy" ]; then
    echo -e "${YELLOW}⚠ Proxy settings detected:${NC}"
    echo "  http_proxy=$http_proxy"
    echo "  https_proxy=$https_proxy"
    echo "  This might interfere with AWS SES connections"
else
    echo -e "${GREEN}✓ No proxy settings detected${NC}"
fi
echo ""

# 3. Test again
echo "=== Re-testing After Fixes ==="
test_https
test_aws_ses
echo ""

# Final diagnosis
echo "=== Final Diagnosis ==="
if test_https && test_aws_ses; then
    echo -e "${GREEN}✓ Network connectivity is working!${NC}"
    echo ""
    echo "Restarting Docker services..."
    cd /root/website
    docker-compose -f docker-compose.prod.yml restart app
    echo -e "${GREEN}✓ Docker services restarted${NC}"
else
    echo -e "${RED}✗ Network connectivity issue persists${NC}"
    echo ""
    echo "This appears to be a Digital Ocean network-level issue."
    echo ""
    echo "Next Steps:"
    echo "1. Check Digital Ocean Dashboard → Networking → Firewalls"
    echo "2. Ensure your droplet's firewall allows outbound HTTPS (port 443)"
    echo "3. Check if droplet is in a VPC with egress restrictions"
    echo "4. Contact Digital Ocean support if issue persists"
    echo ""
    echo "Droplet IP: $(hostname -I | awk '{print $1}')"
fi

echo ""
echo "=========================================="
echo "Script completed"
echo "=========================================="
