#!/bin/bash

# Setup script for listings.brightone.ca subdomain with HTTPS
# This script helps configure SSL certificates and DNS for the subdomain

set -e

echo "🔧 Setting up HTTPS for listings.brightone.ca subdomain..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    print_error "Certbot is not installed. Please install it first:"
    echo "sudo apt update && sudo apt install certbot python3-certbot-nginx"
    exit 1
fi

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    print_error "Nginx is not installed. Please install it first."
    exit 1
fi

print_status "Step 1: DNS Configuration"
echo "Please ensure the following DNS records are configured:"
echo ""
echo "Type: A"
echo "Name: listings"
echo "Value: [YOUR_SERVER_IP]"
echo "TTL: 300 (or default)"
echo ""
echo "Type: AAAA (if you have IPv6)"
echo "Name: listings"
echo "Value: [YOUR_SERVER_IPv6]"
echo "TTL: 300 (or default)"
echo ""
read -p "Have you configured the DNS records? (y/n): " dns_configured

if [[ $dns_configured != "y" && $dns_configured != "Y" ]]; then
    print_warning "Please configure DNS records first, then run this script again."
    exit 1
fi

print_status "Step 2: Testing DNS resolution"
if nslookup listings.brightone.ca > /dev/null 2>&1; then
    print_success "DNS resolution working for listings.brightone.ca"
else
    print_warning "DNS resolution not working yet. This might take a few minutes to propagate."
    echo "You can continue, but SSL certificate generation might fail."
    read -p "Continue anyway? (y/n): " continue_anyway
    if [[ $continue_anyway != "y" && $continue_anyway != "Y" ]]; then
        exit 1
    fi
fi

print_status "Step 3: Updating SSL certificate to include subdomain"
echo "This will add listings.brightone.ca to your existing SSL certificate."

# Check if certificate already exists
if [ -f "/etc/letsencrypt/live/brightone.ca/fullchain.pem" ]; then
    print_status "Existing certificate found. Adding subdomain to certificate..."
    
    # Add subdomain to existing certificate
    sudo certbot certonly --nginx -d brightone.ca -d www.brightone.ca -d listings.brightone.ca --expand
    
    if [ $? -eq 0 ]; then
        print_success "SSL certificate updated successfully!"
    else
        print_error "Failed to update SSL certificate"
        exit 1
    fi
else
    print_status "No existing certificate found. Creating new certificate..."
    
    # Create new certificate with all domains
    sudo certbot certonly --nginx -d brightone.ca -d www.brightone.ca -d listings.brightone.ca
    
    if [ $? -eq 0 ]; then
        print_success "SSL certificate created successfully!"
    else
        print_error "Failed to create SSL certificate"
        exit 1
    fi
fi

print_status "Step 4: Testing nginx configuration"
sudo nginx -t

if [ $? -eq 0 ]; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration has errors. Please fix them before proceeding."
    exit 1
fi

print_status "Step 5: Reloading nginx"
sudo systemctl reload nginx

if [ $? -eq 0 ]; then
    print_success "Nginx reloaded successfully"
else
    print_error "Failed to reload nginx"
    exit 1
fi

print_status "Step 6: Testing HTTPS connection"
echo "Testing HTTPS connection to listings.brightone.ca..."

# Test HTTPS connection
if curl -s -o /dev/null -w "%{http_code}" https://listings.brightone.ca | grep -q "200\|301\|302"; then
    print_success "HTTPS connection working!"
else
    print_warning "HTTPS connection test failed. This might be normal if the app isn't running yet."
fi

print_success "Setup completed!"
echo ""
echo "Next steps:"
echo "1. Make sure your Next.js application is running on port 3000"
echo "2. Test the subdomain: https://listings.brightone.ca"
echo "3. Test a sample listing: https://listings.brightone.ca/123-main-street-toronto"
echo ""
echo "To set up automatic certificate renewal:"
echo "sudo crontab -e"
echo "Add this line: 0 12 * * * /usr/bin/certbot renew --quiet"
echo ""
print_success "HTTPS setup for listings.brightone.ca is complete! 🎉"
