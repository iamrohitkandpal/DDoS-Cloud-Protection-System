# 🏗️ System Architecture

## System Components
The DDoS Protection System consists of the following key components:

![Architecture Diagram](images/architecture-diagram.png)

### 1. Traffic Ingestion Layer
- **Nginx Reverse Proxy**: Acts as the first point of contact for all incoming traffic
- **Rate Limiting Module**: Performs initial filtering based on basic rate limiting
- **Request Inspection**: Collects metadata from incoming requests for further analysis

### 2. Analysis Engine
- **Traffic Analyzer**: Processes incoming request patterns
- **Rule Engine**: Applies predefined and custom protection rules
- **Machine Learning Module**: Identifies anomalous patterns that might indicate an attack
- **Decision Maker**: Determines whether to allow, challenge, or block requests

### 3. Cache Layer
- **Redis In-Memory Database**: Maintains:
  - Rate limiting counters
  - IP reputation scores
  - Temporary blacklists
  - Challenge tokens

### 4. Persistent Storage
- **MongoDB Database**: Stores:
  - Long-term traffic statistics
  - Attack patterns and signatures
  - Configuration settings
  - User accounts and audit logs

### 5. Administration Dashboard
- **React Frontend**: Provides:
  - Real-time traffic visualization
  - Attack alerts and notifications
  - Configuration interface
  - Report generation

## Data Flow
1. Incoming request reaches the Nginx proxy
2. Request metadata is captured and sent to the Analysis Engine
3. Analysis Engine checks against Redis cache for rate limits and blacklists
4. If suspicious, detailed analysis is performed
5. Results are stored in MongoDB for long-term analysis
6. Administrators receive alerts through the dashboard

## Deployment Architecture
The system can be deployed in multiple configurations:

### Standard Deployment
![Standard Deployment](images/standard-deployment.png)

### High-Availability Deployment
![HA Deployment](images/ha-deployment.png)

## Technology Stack Details

### Frontend Stack
- React 18+ for UI components
- Redux for state management
- Recharts for data visualization
- Material UI for component styling
- Axios for API communication

### Backend Stack
- Node.js with Express framework
- Socket.IO for real-time communication
- Mongoose ODM for MongoDB interactions
- Redis client for cache operations
- JWT for authentication

### Infrastructure
- Docker containers for consistent deployment
- Kubernetes for orchestration (in HA setup)
- AWS/Azure/NIC Cloud for hosting
- Terraform for infrastructure as code 