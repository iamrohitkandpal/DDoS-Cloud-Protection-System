#!/bin/bash

# ==================================================================
# Nginx Setup Script for DDoS Protection System
# ==================================================================
# This script automates the installation and configuration of nginx
# for the DDoS Protection System
# ==================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration variables
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
NGINX_CONF_DIR="/etc/nginx"
LOG_DIR="/var/log/nginx"
SITE_NAME="ddos-protection"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if script is run as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# Install nginx if not already installed
install_nginx() {
    print_status "Checking if nginx is installed..."
    
    if ! command -v nginx &> /dev/null; then
        print_status "Installing nginx..."
        apt update
        apt install -y nginx
    else
        print_status "Nginx is already installed"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    # Create log directory if it doesn't exist
    mkdir -p "$LOG_DIR"
    
    # Create sites directories if they don't exist
    mkdir -p "$NGINX_SITES_AVAILABLE"
    mkdir -p "$NGINX_SITES_ENABLED"
    
    # Create web root directory
    mkdir -p "/var/www/ddos-protection/frontend/dist"
    chown -R www-data:www-data "/var/www/ddos-protection"
}

# Backup existing nginx configuration
backup_config() {
    print_status "Backing up existing nginx configuration..."
    
    if [ -f "$NGINX_CONF_DIR/nginx.conf" ]; then
        cp "$NGINX_CONF_DIR/nginx.conf" "$NGINX_CONF_DIR/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)"
        print_status "Backup created: nginx.conf.backup.$(date +%Y%m%d_%H%M%S)"
    fi
}

# Copy configuration files
copy_configs() {
    print_status "Copying nginx configuration files..."
    
    # Copy main nginx.conf
    if [ -f "./nginx.conf" ]; then
        cp "./nginx.conf" "$NGINX_CONF_DIR/nginx.conf"
        print_status "Main nginx.conf copied"
    else
        print_warning "nginx.conf not found in current directory"
    fi
    
    # Copy site configuration
    if [ -f "./ddos-protection.conf" ]; then
        cp "./ddos-protection.conf" "$NGINX_SITES_AVAILABLE/$SITE_NAME.conf"
        print_status "Site configuration copied"
    else
        print_error "ddos-protection.conf not found in current directory"
        exit 1
    fi
}

# Enable the site
enable_site() {
    print_status "Enabling the DDoS protection site..."
    
    # Remove default site if it exists
    if [ -L "$NGINX_SITES_ENABLED/default" ]; then
        rm "$NGINX_SITES_ENABLED/default"
        print_status "Removed default nginx site"
    fi
    
    # Create symbolic link to enable our site
    ln -sf "$NGINX_SITES_AVAILABLE/$SITE_NAME.conf" "$NGINX_SITES_ENABLED/$SITE_NAME.conf"
    print_status "DDoS protection site enabled"
}

# Test nginx configuration
test_config() {
    print_status "Testing nginx configuration..."
    
    if nginx -t; then
        print_status "Nginx configuration test passed"
    else
        print_error "Nginx configuration test failed"
        exit 1
    fi
}

# Start and enable nginx service
start_nginx() {
    print_status "Starting and enabling nginx service..."
    
    systemctl start nginx
    systemctl enable nginx
    
    if systemctl is-active --quiet nginx; then
        print_status "Nginx is running successfully"
    else
        print_error "Failed to start nginx"
        exit 1
    fi
}

# Configure firewall (if ufw is available)
configure_firewall() {
    if command -v ufw &> /dev/null; then
        print_status "Configuring firewall..."
        ufw allow 'Nginx Full'
        print_status "Firewall configured for nginx"
    else
        print_warning "UFW firewall not found, skipping firewall configuration"
    fi
}

# Main execution
main() {
    print_status "Starting nginx setup for DDoS Protection System..."
    
    check_root
    install_nginx
    create_directories
    backup_config
    copy_configs
    enable_site
    test_config
    start_nginx
    configure_firewall
    
    print_status "Nginx setup completed successfully!"
    print_status "Your DDoS protection system is now accessible via nginx"
    print_warning "Remember to:"
    print_warning "1. Update server_name in the configuration file"
    print_warning "2. Adjust the backend port (currently set to 3000)"
    print_warning "3. Update the frontend build path if needed"
    print_warning "4. Configure SSL certificates for production use"
}

# Run main function
main "$@"
