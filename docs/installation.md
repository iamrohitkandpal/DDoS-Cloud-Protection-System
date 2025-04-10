# 📦 Installation Guide

## System Requirements
- Node.js 16.x or later
- MongoDB 6.0 or later
- Redis 7.0 or later
- Modern web browser (Chrome, Firefox, Edge)

## Development Setup

### Prerequisites
1. Install Node.js and npm:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. Install MongoDB:
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   ```

3. Install Redis:
   ```bash
   sudo apt update
   sudo apt install redis-server
   sudo systemctl enable redis-server
   ```

### Repository Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/iamrohitkandpal/ddos-protection-system.git
   cd ddos-protection-system
   ```

2. Set up backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. Set up frontend:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

## Production Deployment

### Using Docker
1. Build Docker images:
   ```bash
   docker-compose build
   ```
2. Run the containers:
   ```bash
   docker-compose up -d
   ```

### Manual Deployment
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Set up Nginx:
   ```bash
   sudo apt install nginx
   sudo cp deployment/nginx/ddos-protection.conf /etc/nginx/sites-available/
   sudo ln -s /etc/nginx/sites-available/ddos-protection.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

3. Set up the backend service:
   ```bash
   sudo cp deployment/systemd/ddos-protection.service /etc/systemd/system/
   sudo systemctl enable ddos-protection
   sudo systemctl start ddos-protection
   ```

## Verification
After installation, verify the system is working:

1. Open your browser and navigate to `http://localhost:3000` (development) or your domain (production)
2. Log in with the default admin credentials:
   - Username: `admin@example.com`
   - Password: `changeme123`
3. Visit the dashboard to confirm data is being collected

> **Important**: Change the default admin password immediately after first login!

## Troubleshooting

### Common Issues
1. **MongoDB Connection Errors**
   - Check if MongoDB is running: `sudo systemctl status mongod`
   - Verify connection string in .env file

2. **Redis Connection Issues**
   - Check Redis status: `sudo systemctl status redis`
   - Ensure Redis is accepting connections: `redis-cli ping`

3. **Frontend Not Loading**
   - Check for console errors in browser developer tools
   - Verify API URL in frontend .env file

4. **Backend Service Failures**
   - Check logs: `sudo journalctl -u ddos-protection`
   - Verify environment variables and permissions 
