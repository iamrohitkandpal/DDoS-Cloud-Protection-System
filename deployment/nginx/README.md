# Nginx Configuration for DDoS Protection System

This directory contains a well-structured, production-ready nginx configuration for the DDoS Protection System. The configuration provides reverse proxy functionality with built-in DDoS protection features.

## 📁 Files Overview

```
nginx/
├── ddos-protection.conf    # Main site configuration
├── nginx.conf             # Global nginx settings
├── setup-nginx.sh         # Automated setup script
└── README.md              # This documentation
```

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
# Navigate to the nginx directory
cd deployment/nginx

# Make the setup script executable
chmod +x setup-nginx.sh

# Run the setup script (requires sudo)
sudo ./setup-nginx.sh
```

### Option 2: Manual Setup
```bash
# Install nginx
sudo apt update && sudo apt install nginx -y

# Copy configurations
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo cp ddos-protection.conf /etc/nginx/sites-available/ddos-protection.conf

# Enable the site
sudo ln -s /etc/nginx/sites-available/ddos-protection.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default  # Remove default site

# Test and restart
sudo nginx -t && sudo systemctl restart nginx
```

## 🛡️ Security Features

### 1. **Rate Limiting**
- **General requests**: 10 requests/second per IP
- **API endpoints**: 5 requests/second per IP
- **Burst protection**: Allows temporary traffic spikes
- **Connection limiting**: Max 15 concurrent connections per IP

### 2. **DDoS Protection**
- Request size limits (10MB max)
- Timeout protection against slow attacks
- Buffer size optimization
- Connection throttling

### 3. **Security Headers**
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-XSS-Protection`: Cross-site scripting protection
- `Referrer-Policy`: Controls referrer information
- `X-Robots-Tag`: Prevents search engine indexing

### 4. **Access Control**
- Blocks access to hidden files (`.git`, `.env`)
- Blocks sensitive directories (`/admin`, `/config`)
- Blocks backup files (`.bak`, `.tmp`)

## 🔧 Configuration Sections Explained

### Rate Limiting Zones
```nginx
limit_req_zone $binary_remote_addr zone=ddos_general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=ddos_api:10m rate=5r/s;
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;
```
- **ddos_general**: For frontend and general requests
- **ddos_api**: Stricter limits for API endpoints
- **conn_limit**: Connection-based limiting

### Frontend Static Files (`/`)
- Serves React/Vue/Angular applications
- SPA routing support with fallback to `index.html`
- Static asset caching (CSS, JS, images)
- Rate limiting: 10 req/sec with burst of 20

### API Proxy (`/api/`)
- Proxies to Node.js backend (port 3000)
- Stricter rate limiting: 5 req/sec with burst of 10
- Real-time data support (buffering disabled)
- Proper proxy headers for client identification

### WebSocket Support (`/socket.io/`)
- Real-time communication support
- WebSocket-specific headers
- Extended timeouts for persistent connections
- Moderate rate limiting

## 📊 Monitoring & Logs

### Log Files
- **Access logs**: `/var/log/nginx/ddos-protection-access.log`
- **Error logs**: `/var/log/nginx/ddos-protection-error.log`
- **Main nginx logs**: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`

### Custom Log Format
The configuration includes a custom log format that captures:
- Client IP address
- Request timing
- User agent
- Response codes
- Request processing time

### Health Check
- Endpoint: `/nginx-health`
- Returns: `200 OK` with "healthy" message
- No logging (for monitoring systems)

## ⚙️ Customization

### 1. **Backend Port Configuration**
Update the backend port in `ddos-protection.conf`:
```nginx
proxy_pass http://127.0.0.1:YOUR_PORT/;
```

### 2. **Domain Name**
Update the server name:
```nginx
server_name your-domain.com www.your-domain.com;
```

### 3. **Rate Limiting Adjustment**
For higher traffic, adjust rate limits:
```nginx
# More permissive settings
limit_req_zone $binary_remote_addr zone=ddos_general:10m rate=50r/s;
limit_req zone=ddos_general burst=100 nodelay;
```

### 4. **Static File Path**
Update the frontend build path:
```nginx
root /path/to/your/frontend/build;
```

## 🔒 SSL/HTTPS Configuration

To enable HTTPS, add to your server block:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # SSL security settings are already included in nginx.conf
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check if your backend server is running: `systemctl status your-backend-service`
   - Verify the proxy port matches your backend
   - Check nginx error logs: `sudo tail -f /var/log/nginx/ddos-protection-error.log`

2. **Too Many Requests (429)**
   - Rate limiting is working correctly
   - Increase rate limits if legitimate traffic is being blocked
   - Check client IP for debugging

3. **WebSocket Connection Failed**
   - Verify backend WebSocket server is running
   - Check WebSocket proxy configuration
   - Review browser console for errors

4. **Static Files Not Loading**
   - Verify frontend build path exists
   - Check file permissions: `sudo chown -R www-data:www-data /var/www/ddos-protection`
   - Ensure nginx has read access to files

### Debug Commands

```bash
# Test nginx configuration
sudo nginx -t

# Reload nginx (without downtime)
sudo systemctl reload nginx

# Check nginx status
sudo systemctl status nginx

# View real-time access logs
sudo tail -f /var/log/nginx/ddos-protection-access.log

# View real-time error logs
sudo tail -f /var/log/nginx/ddos-protection-error.log

# Check rate limiting in action
sudo grep "limiting" /var/log/nginx/ddos-protection-error.log
```

## 📈 Performance Optimization

### For High Traffic Websites

1. **Increase Worker Processes**
```nginx
# In nginx.conf
worker_processes auto;  # Uses all CPU cores
worker_connections 2048;  # Increase connections per worker
```

2. **Adjust Rate Limits**
```nginx
# More permissive rate limiting
limit_req_zone $binary_remote_addr zone=ddos_general:10m rate=100r/s;
limit_req zone=ddos_general burst=200 nodelay;
```

3. **Enable Caching**
```nginx
# Add to server block
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🔄 Updates and Maintenance

### Regular Maintenance Tasks

1. **Log Rotation**: Configure logrotate for nginx logs
2. **Configuration Backup**: Keep backups of working configurations
3. **Security Updates**: Regularly update nginx and modules
4. **Performance Monitoring**: Monitor response times and error rates

### Configuration Testing

Always test configuration changes:
```bash
# Test configuration syntax
sudo nginx -t

# Test configuration and show details
sudo nginx -T
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review nginx error logs
3. Verify backend service is running
4. Test configuration syntax with `nginx -t`

For project-specific issues, refer to the main project documentation.
