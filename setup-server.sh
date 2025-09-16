#!/bin/bash

# Function to handle errors
handle_error() {
    echo "❌ Error occurred at line $1"
    echo "Attempting to fix..."
    sudo dpkg --configure -a
    sudo apt --fix-broken install
    exit 1
}

# Set error trap
trap 'handle_error $LINENO' ERR

echo "🚀 Starting server setup..."

# Update system with error handling
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages first
echo "�� Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# Install Certbot
echo "🔒 Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Configure firewall
echo "�� Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create website directory
echo "�� Creating website directory..."
sudo mkdir -p /home/brightone/website
sudo chown -R $USER:$USER /home/brightone/website

# Create backup directory
sudo mkdir -p /home/brightone/backups
sudo chown -R $USER:$USER /home/brightone/backups

echo "✅ Server setup completed successfully!"
echo "🔄 Please logout and login again to apply Docker group changes"
echo "📝 Next steps:"
echo "   1. Configure your domain DNS to point to this server"
echo "   2. Set up SSL certificate with: sudo certbot --nginx -d brightone.ca -d www.brightone.ca"
echo "   3. Deploy your application using GitHub Actions"