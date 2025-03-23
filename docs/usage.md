# 📘 Usage Guide

## Dashboard Overview
The DDoS Protection System dashboard provides a comprehensive view of your protected websites' traffic and security status.

![Dashboard Overview](images/dashboard-overview.png)

### Main Dashboard Sections
1. **Traffic Overview**: Real-time and historical traffic graphs
2. **Threat Map**: Geographical visualization of traffic sources
3. **Protection Status**: Current security level and active protections
4. **Alert Log**: Recent security events and notifications
5. **System Health**: Status of all system components

## User Management

### Adding Users
1. Navigate to **Settings > User Management**
2. Click **Add User**
3. Fill in the required fields:
   - Email address
   - Name
   - Role (Admin, Analyst, or Viewer)
   - Initial password
4. Click **Create User**

### Managing Roles
The system supports three roles:
- **Admin**: Full access to all system features
- **Analyst**: Can view dashboards and reports, modify some settings
- **Viewer**: Read-only access to dashboards and reports

## Protection Configuration

### Creating Protection Rules
1. Go to **Settings > Protection Rules**
2. Click **Add Rule**
3. Configure rule parameters:
   - Rule name and description
   - Rate limiting thresholds
   - IP reputation settings
   - Geographic restrictions
   - HTTP signature patterns
4. Set rule priority and actions (Block, Challenge, Monitor)
5. Click **Save Rule**

### Example Rules
```json
{
  "name": "Basic Rate Limiting",
  "description": "Limits requests per IP address",
  "conditions": {
    "requests_per_minute": 60,
    "burst_allowance": 10
  },
  "action": "challenge",
  "priority": 10
}
```

```json
{
  "name": "Known Attack Patterns",
  "description": "Blocks requests with known attack signatures",
  "conditions": {
    "http_patterns": [
      "wp-login.php",
      "xmlrpc.php",
      ".env"
    ]
  },
  "action": "block",
  "priority": 5
} 