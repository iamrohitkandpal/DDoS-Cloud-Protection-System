# Nginx Setup for DDoS Protection System

This guide explains how to set up Nginx as a reverse proxy for the DDoS Protection System, providing an additional layer of security and performance.

## Prerequisites

- Ubuntu 20.04 or later (or equivalent Linux distribution)
- Nginx 1.18 or newer
- Root or sudo access

## Installation

### 1. Install Nginx

```bash
# Update package index
sudo apt update

# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Configure Firewall (if enabled)

```bash
# Allow Nginx through firewall
sudo ufw allow 'Nginx Full'
```

### 3. Install DDoS Protection System Configuration

```bash
# Copy configuration file
sudo cp /path/to/ddos-protection.conf /etc/nginx/sites-available/

# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/ddos-protection.conf /etc/nginx/sites-enabled/

# Remove default config (optional)
sudo rm /etc/nginx/sites-enabled/default
```

### 4. Test and Reload Nginx

```bash
# Test configuration
sudo nginx -t

# If successful, reload Nginx
sudo systemctl reload nginx
```

## Configuration Details

The Nginx configuration provides multiple layers of protection:

1. **Rate Limiting**: Restricts the number of requests from a single IP
2. **Connection Limiting**: Prevents too many simultaneous connections
3. **Timeout Settings**: Mitigates slow HTTP attacks
4. **Security Headers**: Adds basic browser security features
5. **Path Filtering**: Blocks access to sensitive files

### Key Configuration Elements

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=ddos_limit:10m rate=10r/s;

# Apply rate limiting to locations
limit_req zone=ddos_limit burst=20 nodelay;
```

The `rate=10r/s` setting allows 10 requests per second per IP address. The `burst=20` parameter allows a burst of 20 requests to exceed this rate temporarily.

## Customization

### Adjusting Rate Limits

For higher-traffic websites, you may need to increase the rate limits:

```nginx
# Higher traffic configuration
limit_req_zone $binary_remote_addr zone=ddos_limit:10m rate=30r/s;
limit_req zone=ddos_limit burst=60 nodelay;
```

### Blocking IPs by Country

To block traffic from specific countries, install the GeoIP module and add:

```nginx
# Load GeoIP module
load_module modules/ngx_http_geoip_module.so;

# In http block
http {
    geoip_country /usr/share/GeoIP/GeoIP.dat;
    
    # In server block
    if ($geoip_country_code = "XX") { # Replace XX with country code
        return 403;
    }
}
```

## New Security Headers
add_header X-Content-Type-Options "nosniff" always;
add_header Permissions-Policy "interest-cohort=()";
add_header Cross-Origin-Embedder-Policy "require-corp";

## Enhanced Rate Limiting
limit_req_zone $http_x_forwarded_for zone=proxy_limit:10m rate=100r/s;
limit_conn_zone $http_x_forwarded_for zone=conn_limit:10m;

## WebSocket Support
location /wss/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header X-Real-IP $remote_addr;
}

## Fail2Ban Integration
# Block repeated offenders at firewall level
fail2ban-regex /var/log/nginx/ddos-protection-access.log ^<HOST>.*"(GET|POST).* 4\d\d

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check if backend server is running: `systemctl status ddos-protection`
   - Verify port configuration matches backend service

2. **Rate Limiting Too Aggressive**
   - Increase rate limits and burst parameters in the configuration

3. **WebSocket Connection Failures**
   - Ensure WebSocket proxy settings are configured correctly

## Monitoring

Monitor Nginx performance and access logs:

```bash
# View error logs
sudo tail -f /var/log/nginx/ddos-protection-error.log

# View access logs
sudo tail -f /var/log/nginx/ddos-protection-access.log
```